// Data abstraction layer

import path from 'path'
import sqlite3 from 'sqlite3'

export function toISO (date) {
  function pad(number) {
    if (number < 10) {
      return '0' + number
    }
    return number
  }
  
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
}


export class Version {

  constructor (folder) {
    this._fname = folder
    this._db = null
  }

  _connect () {
    this._db = new sqlite3.Database(this._fname)
  }

  _close () {
    if (this._db) {
      this._db.close()
    }
  }

  _run (sql, params) {
    // allow queries to be using asynchronously

    if (this._db) { 
      return new Promise((resolve, reject) => {
	this._db.all(sql, params, function (error, rows) {
	  if (error)
	    reject(error)
	  else
	    resolve(rows)
	})
      })
    }
  }

  async create (desc) {
    this._connect()
    const results = await this._run(`SELECT * FROM version LIMIT 1`, [])
    if (results.length > 0) {
      throw 'Version # already exists'
    }
    await this._run(`INSERT INTO version VALUES (?)`, [desc.version])
    this._close()
  }

  async update (desc) {
    this._connect()
    const results = await this._run(`SELECT * FROM version LIMIT 1`)
    if (results.length > 0) {
      await this._run(`UPDATE version SET version = ?`, [desc.version])
    }
    else {
      await this._run(`INSERT INTO version VALUES (?)`, [desc.version])
    }
    this._close()
  }
  
  async read () {
    this._connect()
    const rows = await this._run(`SELECT * FROM version LIMIT 1`)
    if (rows.length > 0) { 
      return {version: rows[0].version}
    }
  }
}


export class Tags {

  constructor (folder) {
    this._fname = folder
  }

  _connect () {
    this._db = new sqlite3.Database(this._fname)
  }

  _close () {
    if (this._db) {
      this._db.close()
    }
  }

  _run (sql, params) {
    // allow queries to be using asynchronously
    if (this._db) { 
      return new Promise((resolve, reject) => {
	this._db.all(sql, params, function (error, rows) {
	  if (error)
	    reject(error)
	  else
	    resolve(rows)
	})
      })
    }
  }

  async create (desc) {
    this._connect()
    const rows = await this._run(`SELECT * FROM tags WHERE uuid = ? and tag = ? LIMIT 1`,
			         [desc.uuid, desc.tag])
    if (rows.length > 0) {
      throw `UUID ${desc.uuid} and tag ${desc.tag} already exist`
    }
    await this._run(`INSERT INTO tags VALUES (?, ?)`, [desc.uuid, desc.tag])
    this._close()
  }

  async delete (uuid, tag) {
    this._connect()
    await this._run(`DELETE FROM tags WHERE uuid = ? AND tag = ?`, [uuid, tag])
    this._close()
  }

  async delete_all_by_uuid (uuid) {
    this._connect()
    await this._run(`DELETE FROM tags WHERE uuid = ?`, [uuid])
    this._close()
  }

  async read_by_uuid (uuid) {
    this._connect()
    const rows = await this._run(`SELECT * FROM tags WHERE uuid = ?`, [uuid])
    this._close()
    return rows
  }

  async read_by_uuids (uuids) {
    this._connect()
    if (uuids.length > 990) {
      throw `About to hit the limit of the number of uuids that can be looked up at once`
    }
    const uuid_str = uuids.map(r => '?').join(', ')
    const rows = await this._run(`SELECT * FROM tags WHERE uuid IN (${uuid_str})`, uuids)
    this._close()
    return rows
  }

  async read_all_tags () {
    this._connect()
    let rows = await this._run(`SELECT distinct tag FROM tags`)
    // rows = rows.map(r => ({tag: r.tag}))
    this._close()
    return rows
  }
}


export class Images {
  
  constructor (folder) {
    this._fname = folder
  }

  _connect () {
    this._db = new sqlite3.Database(this._fname)
  }

  _close () {
    if (this._db) {
      this._db.close()
    }
  }

  _run (sql, params) {
    // allow queries to be using asynchronously
    if (this._db) { 
      return new Promise((resolve, reject) => {
	this._db.all(sql, params, function (error, rows) {
	  if (error)
	    reject(error)
	  else
	    resolve(rows)
	})
      })
    }
  }

  async create (desc) {
    this._connect()
    const timestamp = toISO(new Date())
    let rows = await this._run(`SELECT * FROM images WHERE uuid = ? LIMIT 1`, [desc.uuid])
    if (rows.length > 0) {
      throw `UUID ${desc.uuid} already exists`
    }
    await this._run(`INSERT INTO images VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      desc.uuid,
      desc.mime,
      desc.image,
      desc.content.join('\n\n'),
      timestamp,
      timestamp,
      null,
      desc.draft ? 1 : 0
    ])
    this._close()
  }

  async update (desc) {
    this._connect()
    const timestamp = toISO(new Date())
    let rows = await this._run(`SELECT * FROM images WHERE uuid = ? LIMIT 1`, [desc.uuid])
    if (rows.length > 0) {
      await this._run(`DELETE FROM images WHERE uuid = ?`, [desc.uuid])
    }
    await this._run(`INSERT INTO images VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
      desc.uuid,
      desc.mime,
      desc.image,
      desc.content.join('\n\n'),
      toISO(desc.date_created),
      timestamp,
      desc.date_published && desc.draft == 0 ? toISO(desc.date_published) : null,
      desc.draft ? 1 : 0
    ])
    this._close()
  }

  async delete (uuid) {
    this._connect()
    await this._run(`DELETE FROM images WHERE uuid = ?`, [uuid])
    this._close()
  }

  _process_row (r) {
    return { uuid: r.uuid,
             mime: r.mime,
             image: r.image,
             content: r.content.split('\n\n'),
             date_created: new Date(r.date_created),
             date_updated: new Date(r.date_updated),
             date_published: r.date_published ? new Date(r.date_published) : null,
             draft: r.draft ? true : false }
  }

  async count_all () {
    this._connect()
    const rows = await this._run(`SELECT count(*) as ct FROM images WHERE draft = 0`)
    this._close()
    return rows[0]
  }

  async count_all_drafts () {
    this._connect()
    const rows = await this._run(`SELECT count(*) as ct FROM images WHERE draft = 1 AND content IS NOT NULL AND content <> ''`)
    this._close()
    return rows[0]
  }

  async count_all_new () {
    this._connect()
    const rows = await this._run(`SELECT count(*) as ct FROM images WHERE draft = 1 AND (content IS NULL OR content = '')`)
    this._close()
    return rows[0]
  }

  async count_all_by_tag (tag) {
    this._connect()
    const rows = await this._run(`SELECT count(*) as ct FROM images WHERE uuid IN (SELECT uuid FROM tags WHERE tag = ?) AND draft = 0`, [tag])
    this._close()
    return rows[0]
  }

  async read_all (offset, limit) {
    if (offset === 'undefined') {
      offset = 0
    }
    if (limit === 'undefined') {
      limit = 10
    }
    this._connect()
    let results = await this._run(`SELECT * FROM images WHERE draft = 0 ORDER BY date_published desc LIMIT ? OFFSET ?`, [limit, offset])
    results = results.map(r => this._process_row(r))
    this._close()
    return results
  }

  async read_all_by_tag (tag, offset, limit) {
    if (offset === 'undefined') {
      offset = 0
    }
    if (limit === 'undefined') {
      limit = 10
    }
    this._connect()
    let results = await this._run(`SELECT * FROM images WHERE uuid IN (SELECT uuid FROM tags WHERE tag = ?) AND draft = 0 ORDER BY date_published desc LIMIT ? OFFSET ?`, [tag, limit, offset])
    results = results.map(r => this._process_row(r))
    this._close()
    return results
  }

  async read_all_drafts (offset, limit) {
    if (offset === 'undefined') {
      offset = 0
    }
    if (limit === 'undefined') {
      limit = 10
    }
    this._connect()
    let results = await this._run(`SELECT * FROM images WHERE draft = 1 AND content IS NOT NULL AND content <> '' ORDER BY date_updated desc LIMIT ? OFFSET ?`, [limit, offset])
    results = results.map(r => this._process_row(r))
    this._close()
    return results
  }

  async read_all_new (offset, limit) {
    if (offset === 'undefined') {
      offset = 0
    }
    if (limit === 'undefined') {
      limit = 10
    }
    this._connect()
    // new pictures are ordered by creation date...
    let results = await this._run(`SELECT * FROM images WHERE draft = 1 AND (content IS NULL OR content = '') ORDER BY date_created desc LIMIT ? OFFSET ?`, [limit, offset])
    results = results.map(r => this._process_row(r))
    this._close()
    return results
  }

  async read (uuid) {
    this._connect()
    const results = await this._run(`SELECT * FROM images WHERE uuid = ?` , [uuid])
    if (results.length > 0) {
      if (results.length > 1) {
	throw `Too many rows ${results.length} for UUID ${uuid}`
      }
      return this._process_row(results[0])
    }
  }

  async read_previous (uuid) {
    this._connect()
    const results = await this._run(`SELECT * FROM images WHERE uuid = ?` , [uuid])
    if (results.length > 0) {
      if (results.length > 1) {
	throw `Too many rows ${results.length} for UUID ${uuid}`
      }
      const date = results[0].date_created
      const results2 = await this._run(`SELECT * FROM images WHERE date_created < ? ORDER BY date_created DESC LIMIT 1`, [date])
      if (results2.length > 0) {
	return this._process_row(results2[0])
      }
    }
  }

  async read_next (uuid) {
    this._connect()
    const results = await this._run(`SELECT * FROM images WHERE uuid = ?` , [uuid])
    if (results.length > 0) {
      if (results.length > 1) {
	throw `Too many rows ${results.length} for UUID ${uuid}`
      }
      const date = results[0].date_created
      const results2 = await this._run(`SELECT * FROM images WHERE date_created > ? ORDER BY date_created ASC LIMIT 1`, [date])
      if (results2.length > 0) {
	return this._process_row(results2[0])
      }
    }
  }
}
