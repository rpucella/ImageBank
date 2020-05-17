'''
Data Abstraction Layer

'''

import datetime
import sqlite3
import os


_IMAGES_DB = 'images.db'


class Version:

    def __init__ (self, path):
        self._fname = os.path.join(path, _IMAGES_DB)

    def _cursor (self):
        self._conn = sqlite3.connect(self._fname)
        return self._conn.cursor()

    def _close (self):
        if self._conn:
            self._conn.commit()
            self._conn.close()

    def create_table (self):
        c = self._cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS version (
                       version int
                     )''')
        self._close()

    def create (self, desc):
        c = self._cursor()
        c.execute('''SELECT * FROM version LIMIT 1''')
        if c.fetchall():
            raise Exception('Version # already exists')
        c.execute('''INSERT INTO version VALUES (?)''',
                  (desc['version'],))
        self._close()

    def update (self, desc):
        c = self._cursor()
        c.execute('''SELECT * FROM version LIMIT 1''')
        if c.fetchall():
            c.execute('''UPDATE version SET version = ?''',
                      (desc['version'],))
        else:
            c.execute('''INSERT INTO verion VALUES (?)''',
                      (desc['version'],))
        self._close()

    def read (self):
        c = self._cursor()
        c.execute('''SELECT * FROM version LIMIT 1''')
        rows = c.fetchall()
        if rows:
            return {'version': rows[0][0]}
        else:
            return None
        

class Tags:

    def __init__ (self, path):
        self._fname = os.path.join(path, _IMAGES_DB)

    def _cursor (self):
        self._conn = sqlite3.connect(self._fname)
        return self._conn.cursor()

    def _close (self):
        if self._conn:
            self._conn.commit()
            self._conn.close()

    def create_table (self):
        c = self._cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS tags (
                       uuid text,
                       tag text
                     )''')
        self._close()

    def create (self, desc):
        c = self._cursor()
        c.execute('''SELECT * FROM tags WHERE uuid = ? and tag = ? LIMIT 1''',
                  (desc['uuid'], desc['tag']))
        if c.fetchall():
            raise Exception('UUID {} and tag {} already exist'.format(desc['uuid'], desc['tag']))
        c.execute('''INSERT INTO tags VALUES (?, ?)''',
                  (desc['uuid'], desc['tag']))
        self._close()

    def delete (self, uuid, tag):
        c = self._cursor()
        c.execute('''DELETE FROM tags WHERE uuid = ? AND tag = ?''', (uuid, tag))
        self._close()

    def delete_all_by_uuid (self, uuid):
        c = self._cursor()
        c.execute('''DELETE FROM tags WHERE uuid = ?''', (uuid, ))
        self._close()

    # should rewrite to return JSON objects
    def read_by_uuid (self, uuid):
        c = self._cursor()
        c.execute('''SELECT * FROM tags WHERE uuid = ?''', (uuid,))
        result = c.fetchall()
        self._close()
        return result

    def read_by_uuids (self, uuids):
        if len(uuids) > 990:
            raise Exception('About to hit the limit of the number of uuids that can be looked up at once')
        c = self._cursor()
        c.execute('''SELECT * FROM tags WHERE uuid IN ({})'''.format(', '.join('?' for r in uuids)), uuids)
        result = c.fetchall()
        self._close()
        return result

    def read_all_tags (self):
        c = self._cursor()
        c.execute('''SELECT distinct tag FROM tags''')
        result = [ {'tag': r[0] } for r in c ]
        self._close()
        return result
        

class Images:

    def __init__ (self, path):
        self._fname = os.path.join(path, _IMAGES_DB)

    # FIXME - timestamp -> created, then add updated
    def create_table (self):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS images (
                       uuid text,
                       extension text,
                       content text,
                       ordinal int, 
                       timestamp text,
                       draft int
                     )''')
        conn.commit()
        conn.close()

        
    def create (self, desc):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        timestamp = datetime.datetime.now()
        c.execute('''SELECT max(ordinal) FROM images''')
        rows = c.fetchall()
        if rows:
            ordinal = rows[0][0] + 1
        else:
            # in case we have no tables
            ordinal = 1
        c.execute('''SELECT * FROM images WHERE uuid = ? LIMIT 1''',
                  (desc['uuid'],))
        if c.fetchall():
            raise Exception('UUID {} already exists'.format(desc['uuid']))
        c.execute('''INSERT INTO images VALUES (?, ?, ?, ?, ?, ?)''',
                  (desc['uuid'],
                   desc['extension'],
                   '\n\n'.join(desc['content']),
                   ordinal,
                   timestamp.isoformat(),
                   desc['draft']))
        conn.commit()
        conn.close()

        
    def update (self, desc):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''SELECT * FROM images WHERE uuid = ? LIMIT 1''',
                  (desc['uuid'],))
        if c.fetchall():
            c.execute('''DELETE FROM images WHERE uuid = ?''', (desc['uuid'],))
        c.execute('''INSERT INTO images VALUES (?, ?, ?, ?, ?, ?)''',
                  (desc['uuid'],
                   desc['extension'],
                   '\n\n'.join(desc['content']),
                   desc['ordinal'],
                   desc['timestamp'].isoformat(),
                   desc['draft']))
        conn.commit()
        conn.close()
        
    def delete (self, uuid):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''DELETE FROM images WHERE uuid = ?''', (uuid,))
        conn.commit()
        conn.close()

    def _process_row (self, r):
        return { 'uuid': r[0],
                 'extension': r[1],
                 'content': r[2].split('\n\n'),
                 'ordinal': r[3],
                 'timestamp': datetime.datetime.fromisoformat(r[4]),
                 'draft': True if r[5] else False}

    def count_all (self):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''SELECT count(*) as ct FROM images WHERE draft = 0''')
        result = c.fetchone()[0]
        conn.close()
        return result

    def read_all (self, offset=0, limit=10):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''SELECT * FROM images WHERE draft = 0 ORDER BY ordinal LIMIT ? OFFSET ?''', (limit, offset))
        results = [ self._process_row(r) for r in c.fetchall() ]
        conn.close()
        return results

    def read_all_by_tag (self, tag, offset=0, limit=10):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''SELECT * FROM images WHERE uuid IN (SELECT uuid FROM tags WHERE tag = ?) AND draft = 0 ORDER BY ordinal LIMIT ? OFFSET ?''', (tag, limit, offset))
        results = [ self._process_row(r) for r in c.fetchall() ]
        conn.close()
        return results
    
    def read_all_drafts (self):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''SELECT * FROM images WHERE draft = 1 ORDER BY datetime(timestamp) desc''')
        results = [ self._process_row(r) for r in c.fetchall() ]
        conn.close()
        return results
        

    def read_recent (self, limit=10):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''SELECT * FROM images where draft = 0 ORDER BY datetime(timestamp) desc LIMIT ?''', (limit,))
        results = [ self._process_row(r) for r in c.fetchall() ]
        conn.close()
        return results

    def read (self, uuid):
        conn = sqlite3.connect(self._fname)
        c = conn.cursor()
        c.execute('''SELECT * FROM images WHERE uuid = ? ORDER BY datetime(timestamp) desc''', (uuid,))
        results = c.fetchall()
        if results:
            if len(results) > 1:
                print('Warning: too many rows {} for UUID {}'.format(len(result), uuid))
                print('         returning most recent only')
            return self._process_row(results[0])
        return None
    
