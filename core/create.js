// Data abstraction layer

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const _IMAGES_DB = 'images.db'

function _run(db, sql, params) {
  // allow queries to be using asynchronously
  return new Promise((resolve, reject) => {
    db.all(sql, params, function (error, rows) {
      if (error)
	reject(error);
      else
	resolve(rows);
    });
  });
}

const _VERSION = `
  CREATE TABLE IF NOT EXISTS version ( 
    version int 
  )
`

const _TAGS = `
  CREATE TABLE IF NOT EXISTS tags (
    uuid text,
    tag text
  )
`

const _IMAGES = `
  CREATE TABLE IF NOT EXISTS images (
    uuid text,
    extension text,
    content text,
    date_created text,
    date_updated text,
    date_published text,
    draft int
  )
`

const _NOTES = `
  CREATE TABLE IF NOT EXISTS notes (
    uuid text,
    content text,
    date_updated text
  )
`

async function create_db(folder) {

  const fname = path.join(folder, _IMAGES_DB);
  db = new sqlite3.Database(fname);
  await _run(db, _VERSION, [])
  await _run(db, _TAGS, [])
  await _run(db, _IMAGES, [])
  await _run(db, _NOTES, [])
}

module.exports = {
  create_db: create_db
}
