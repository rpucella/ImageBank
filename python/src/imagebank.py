import webbrowser
import os
import signal
import sys
import csv
import datetime
import uuid
import re

from flask import Flask, redirect, render_template, request, abort, send_from_directory, jsonify
from waitress import serve
from werkzeug.utils import secure_filename

from dal import Images, Version, Tags

# FIXME - iterate until we find a free port?

_DEFAULT_PORT = 8501
_FOLDER = '<unknown>'
_DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

app = Flask(__name__)

def run (folder):
    global _FOLDER
    _FOLDER = os.path.join(os.getcwd(), folder)
    # check if folder exists!
    # if it doesn't, abort
    # if it does, but there's no DB, initialize it
    # if there's a DB, check version #
    #
    webbrowser.open('http://localhost:{}'.format(_DEFAULT_PORT), new=2)
    serve(app, port=_DEFAULT_PORT)


def inject_link (img):
    img['link'] = '/raw/' + img['uuid'] + '.' + img['extension']
    img['text'] = '\n\n'.join(img['content'])

def inject_tags (img, dtags):
    img['tags'] = dtags[img['uuid']] if img['uuid'] in dtags else []

def group_tags_by_uuid (rows):
    result = {}
    for r in rows:
        if r[0] not in result:
            result[r[0]] = []
        result[r[0]].append(r[1])
    return result
    
@app.route('/')
def main ():
    return redirect('/recent')

@app.route('/kill')
def quit ():
    os.kill(os.getpid(), signal.SIGINT)
    return 'ImageBank server shutdown'

@app.route('/recent')
def recent ():
    recent = Images(_FOLDER).read_recent(limit=10)
    tags = Tags(_FOLDER).read_by_uuids([ r['uuid'] for r in recent])
    dtags = group_tags_by_uuid(tags)
    for r in recent:
        inject_link(r)
        inject_tags(r, dtags)
    return render_template('recent.jinja2', title=_FOLDER, images=recent)


@app.route('/draft')
def drafts ():
    recent = Images(_FOLDER).read_all_drafts()
    tags = Tags(_FOLDER).read_by_uuids([ r['uuid'] for r in recent])
    dtags = group_tags_by_uuid(tags)
    for r in recent:
        inject_link(r)
        inject_tags(r, dtags)
    return render_template('draft.jinja2', title=_FOLDER, images=recent)


@app.route('/page')
def page_default ():
    return redirect('/page/1')


@app.route('/page/<int:p>')
def page (p):
    ##count = Images(_FOLDER).count_all()
    offset = (p - 1) * 10
    if p < 1: ## or offset >= count:
        return abort(404)
    images = Images(_FOLDER).read_all(offset=offset, limit=10)
    tags = Tags(_FOLDER).read_by_uuids([ r['uuid'] for r in images])
    dtags = group_tags_by_uuid(tags)
    for r in images:
        inject_link(r)
        inject_tags(r, dtags)
    pagetitle = 'Page {}'.format(p)
    return render_template('page.jinja2', title=_FOLDER, pagetitle=pagetitle, images=images)


@app.route('/tag')
def tag_all (): 
    tags = Tags(_FOLDER).read_all_tags()
    return render_template('tags.jinja2', title=_FOLDER, tags=tags)


@app.route('/tag/<string:tag>')
def tag_default (tag):
    return redirect('/tag/' + tag + '/1')


@app.route('/tag/<string:tag>/<int:p>')
def tag (tag, p):
    offset = (p - 1) * 10
    if p < 1:
        return abort(404)
    images = Images(_FOLDER).read_all_by_tag(tag, offset=offset, limit=10)
    tags = Tags(_FOLDER).read_by_uuids([ r['uuid'] for r in images])
    dtags = group_tags_by_uuid(tags)
    for r in images:
        inject_link(r)
        inject_tags(r, dtags)
    pagetitle = '{} — Page {}'.format(tag, p)
    return render_template('page.jinja2', title=_FOLDER, pagetitle=pagetitle, images=images)


@app.route('/image/<string:uid>')
def image (uid):
    image = Images(_FOLDER).read(uid)
    tags = Tags(_FOLDER).read_by_uuid(uid)
    dtags = { uid : [ r[1] for r in tags ] }
    inject_link(image)
    inject_tags(image, dtags)
    return render_template('image.jinja2', title=_FOLDER, image=image)


@app.route('/raw/<path:path>')
def raw (path):
    return send_from_directory(_FOLDER, path)


@app.route('/add')
def add ():
    return render_template('add.jinja2', title=_FOLDER)


@app.route('/edit/<string:uid>')
def edit (uid):

    img = Images(_FOLDER).read(uid)
    if not img:
        return abort(404)
    tags = Tags(_FOLDER).read_by_uuid(uid)
    dtags = { uid : [ r[1] for r in tags ] }
    inject_link(img)
    inject_tags(img, dtags)
    return render_template('edit.jinja2', title=_FOLDER, image=img)


@app.route('/post/draft', methods=['POST'])
def post_draft ():

    uid = request.form['uid']
    img = Images(_FOLDER).read(uid)
    if not img:
        return abort(404)
    img['draft'] = 1
    Images(_FOLDER).update(img)
    return jsonify({})


@app.route('/post/publish', methods=['POST'])
def post_publish ():

    uid = request.form['uid']
    img = Images(_FOLDER).read(uid)
    if not img:
        return abort(404)
    img['draft'] = 0
    Images(_FOLDER).update(img)
    return jsonify({})

    
@app.route('/post/edit', methods=['POST'])
def post_edit ():

    uid = request.form['uid']
    text = request.form['text']
    tags = request.form['tags']
    if tags:
        tags = tags.split(' ;; ')
    else:
        tags = []
    text = [ t.strip() for t in text.replace('\r', '').split('\n\n') ]
    img = Images(_FOLDER).read(uid)
    if not img:
        return abort(404)
    img['content'] = text
    Images(_FOLDER).update(img)
    tagstable = Tags(_FOLDER)
    tagstable.delete_all_by_uuid(uid)
    for t in tags:
        tagstable.create({'uuid': uid, 'tag': t})
    return jsonify({})


@app.route('/post/add', methods=['POST'])
def post_add ():

    upload = request.files["file"]

    filename = secure_filename(upload.filename)
    f = filename.strip()
    uid = str(uuid.uuid4())
    m = re.match(r'.*\.([^.]*)', f)
    if not m:
        raise Exception('Cannot figure out extension')
    extension = m.group(1)
    folder = _FOLDER
    Images(folder).create({'uuid': uid,
                           'extension': extension,
                           'content': [],
                           'ordinal': 0,
                           'draft': True},)
    upload.save(os.path.join(folder, uid + '.' + extension))
    return jsonify({'uid': uid})



def cli_add (folder):
    f = input('File: ')
    if not f:
        raise Exception('No file specified')
    f = f.strip()
    uid = str(uuid.uuid4())
    m = re.match(r'.*\.([^.]*)', f)
    if not m:
        raise Exception('Cannot figure out extension')
    extension = m.group(1)
    print('UID = {}'.format(uid))
    print('Extension = {}'.format(extension))
    print('Enter text -- two blank lines to terminate:')
    done = False
    text = []
    current = ''
    while True:
        line = input()
        if line:
            current += line + ' '
        if not line:
            if current:
                text.append(current.strip())
                current = ''
            else:
                break
    Images(folder).create({'uuid': uid,
                           'extension': extension,
                           'content': text,
                           'ordinal': 0,
                           'draft': True})
    os.rename(f, os.path.join(folder, uid + '.' + extension))
    print('Recorded')


if __name__ == '__main__':
    def usage ():
        print('USAGE: imagebank <folder> [--add]')
        sys.exit(1)
    args = sys.argv[1:]
    if args:
        if args[1:]:
            if args[1] == '--add':
                cli_add(args[0])
            else:
                usage()
        else:
            run(args[0])
    else:
        usage()

