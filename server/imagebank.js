
import {Images, Tags, Version} from './dal.js'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import axios from 'axios'

const FOLDER = process.env.IMAGEBANK_DB_FILE

const MIME_EXTENSIONS = {
  'image/jpeg': ['jpeg', 'jpg'],
  'image/png': ['png']
}

function inject_tags (img, dtags) {
  img.tags = dtags[img.uuid] || []
}

function group_tags_by_uuid (rows) {
  const result = {}
  for (let r of rows) {
    result[r.uuid] = result[r.uuid] || []
    result[r.uuid].push(r.tag)
  }
  return result
}

function serializeDates(img) {
  img.date_created = img.date_created?.toISOString() || null
  img.date_updated = img.date_updated?.toISOString() || null
  img.date_published = img.date_published?.toISOString() || null
}

async function downloadImage(url) {
  // Response type `arraybuffer` corresponds to binary data.
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  })
  return response.data
}

// TODO: Add some checks for errors.

class ImageBankImpl {
  
  constructor(folder) {
    this._fname = folder
  }

  async version() {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const v = await new Version(folder).read()
    return v.version
  }

  async drafts(p) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const offset = (p - 1) * 10
    const results = await new Images(folder).read_all_drafts(offset, 10)
    const tags = await new Tags(folder).read_by_uuids(results.map(r => r.uuid))
    const dtags = group_tags_by_uuid(tags)
    for (let r of results) {
      inject_tags(r, dtags)
      // Clear image.
      r.image = null
      serializeDates(r)
    }
    return results
  }

  async drafts_new(p) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const offset = (p - 1) * 16
    const results = await new Images(folder).read_all_new(offset, 16)
    const tags = await new Tags(folder).read_by_uuids(results.map(r => r.uuid))
    const dtags = group_tags_by_uuid(tags)
    for (let r of results) {
      inject_tags(r, dtags)
      // Clear image.
      r.image = null
      serializeDates(r)
    }
    return results
  }

  async count() {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const count = await new Images(folder).count_all()
    return count.ct
  }
  
  async count_drafts() {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const count = await new Images(folder).count_all_drafts()
    return count.ct
  }

  async count_new() {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const count = await new Images(folder).count_all_new()
    return count.ct
  }

  async count_tag(tag) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const count = await new Images(folder).count_all_by_tag(tag)
    return count.ct
  }

  async page(p) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const offset = (p - 1) * 10
    const results = await new Images(folder).read_all(offset, 10)
    const tags = await new Tags(folder).read_by_uuids(results.map(r => r.uuid))
    const dtags = group_tags_by_uuid(tags)
    for (let r of results) {
      inject_tags(r, dtags)
      // Clear image.
      r.image = null
      serializeDates(r)
    }
    return results
  }    

  async tags_all() {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const tags = new Tags(folder).read_all_tags()
    return tags
  }

  async tag (t, p) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const offset = (p - 1) * 10
    const results = await new Images(folder).read_all_by_tag(t, offset, 10)
    const tags = await new Tags(folder).read_by_uuids(results.map(r => r.uuid))
    const dtags = group_tags_by_uuid(tags)
    for (let r of results) {
      inject_tags(r, dtags)
      // Clear image.
      r.image = null
      serializeDates(r)
    }
    return results
  }

  async image (uuid, raw = false) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const image = await new Images(folder).read(uuid)
    const previous = await new Images(folder).read_previous(uuid)
    const next = await new Images(folder).read_next(uuid)
    const tags = await new Tags(folder).read_by_uuid(uuid)
    const dtags = group_tags_by_uuid(tags)
    inject_tags(image, dtags)
    image.previous = previous?.uuid || null
    image.next = next?.uuid || null
    if (!raw) {
      image.image = null
    }
    serializeDates(image)
    return image
  }

  async edit (uuid) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const img = await new Images(folder).read(uuid)
    if (!img) {
      return
    }
    const tags = await new Tags(folder).read_by_uuid(uuid)
    const dtags = group_tags_by_uuid(tags)
    inject_tags(img, dtags)
    return img
  }

  async draft_image (uuid) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const img = await new Images(folder).read(uuid)
    if (!img) {
      throw `Can't find UUID ${uuid}`
    }
    img.draft = true
    await new Images(folder).update(img)
  }

  async publish_image (uuid) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const img = await new Images(folder).read(uuid)
    if (!img) {
      throw `Can't find UUID ${uuid}`
    }
    img.date_published = new Date()
    img.draft = false
    await new Images(folder).update(img)
  }

  async edit_image (uuid, text, tags) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const img = await new Images(folder).read(uuid)
    if (!img) {
      throw `Can't find UUID ${uuid}`
    }
    img.content = text
    await new Images(folder).update(img)
    const tagstable = new Tags(folder)
    await tagstable.delete_all_by_uuid(uuid)
    for (let t of tags) {
      await tagstable.create({'uuid': uuid, 'tag': t})
    }
  }

  async add_image (fileObj) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
//    const f = filename.trim()
    const uuid = uuidv4()
    const dataUri = /data:(.*);base64,(.*)/
    const match = fileObj.match(dataUri)
    if (match) {
      const contentType = match[1]
      const base64 = match[2]
      ///console.log(base64)
      /*
      for (const ct of Object.keys(MIME_EXTENSIONS)) {
        if (MIME_EXTENSIONS[ct].includes(extension)) {
          contentType = ct
          break
        }
        }
      */
      //const image = fs.readFileSync(file)
      const image = Buffer.from(base64, 'base64')
      await new Images(folder).create({'uuid': uuid,
				       'mime': contentType,
                                       'image': image,
				       'content': [],
				       'draft': true})
      return uuid
    }
    console.log(`Unrecognized data URI`)
    throw `Unrecognized extension ${extension}`
  }

  async add_image_url (url) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    const uuid = uuidv4()
    const {headers} = await axios.head(url)
    const contentType = headers['content-type']
    if (!MIME_EXTENSIONS[contentType]) {
      console.log(`Unrecognized MIME type ${contentType}`)
      throw `Unrecognized MIME type ${contentType}`
    }
    const image = await downloadImage(url)
    await new Images(folder).create({'uuid': uuid,
				         'mime': contentType,
                                         'image': image,
				         'content': [],
				         'draft': true})
    return uuid
  }

  async delete_image (uuid) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    await new Tags(folder).delete_all_by_uuid(uuid)
    const img = await new Images(folder).read(uuid)
    await new Images(folder).delete(uuid)
  }

  async create_db(version) {
    const folder = this._fname
    if (!folder) { 
      throw Error("IMAGEBANK_DB_FILE not defined or empty")
    }
    await create.create_db(folder)
    await new Version(folder).create({
      version: version
    })
  }
}

export const ImageBank = new ImageBankImpl(FOLDER)
