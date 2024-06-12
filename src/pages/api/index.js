
import {ImageBank} from '/api/imagebank'
import formidable from 'formidable'

// Disable parsing the body as a JSON.
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const form = new formidable.IncomingForm()
  form.uploadDir = '/tmp'
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    ///console.log(err, fields, files)
    const body = JSON.parse(fields.body)
    switch(body.type) {
      
    case 'post-add': { 
      const upload = files.file
      const filename = upload.originalFilename
      const file = upload.filepath
      const uid = await ImageBank.add_image(file, filename)
      res.status(200).json({ uid })
      break
    }

    case 'post-delete': {
      const {uid} = body
      await ImageBank.delete_image(uid)
      res.status(200).json({ uid })
      break
    }

    case 'post-draft': {
      const {uid} = body
      await ImageBank.draft_image(uid)
      res.status(200).json({ uid })
      break
    }

    case 'post-edit': {
      const {uid, text, tags} = body
      const ntags = tags ? tags.split(' ;; ') : []
      const ntext = text.replace(/\r/g, '').split('\n\n').map(t => t.trim());
      await ImageBank.edit_image(uid, ntext, ntags)
      res.status(200).json({ uid })
      break
    }

    case 'post-publish': {
      const {uid} = body
      await ImageBank.publish_image(uid)
      res.status(200).json({ uid })
      break
    }

    case 'post-url': {
      const {url} = body
      const uid = await ImageBank.add_image_url(url)
      res.status(200).json({ uid })
      break
    }

    case 'get-draft': {
      const page = parseInt(body.page)
      const results = await ImageBank.drafts(page)
      const count = await ImageBank.count_drafts()
      const total_pages = Math.trunc((count - 1) / 10) + 1
      res.status(200).json({ images: results, total: total_pages })
      break
    }
      
    case 'get-image': {
      const {uid} = body
      const image = await ImageBank.image(uid)
      res.status(200).json({ image })
      break
    }
      
    case 'get-image-raw': {
      const {uuid} = body
      const img = await ImageBank.image(uuid, true)
      res.setHeader('Content-Type', img.mime)
      res.status(200).end(img.image)
      break
    }
      
    case 'get-new': {
      const page = parseInt(body.page)
      const results = await ImageBank.drafts_new(page)
      const count = await ImageBank.count_new()
      const total_pages = Math.trunc((count - 1) / 16) + 1
      res.status(200).json({ images: results, total: total_pages })
      break
    }
      
    case 'get-published': {
      const page = parseInt(body.page)
      const results = await ImageBank.page(page)
      const count = await ImageBank.count()
      const total_pages = Math.trunc((count - 1) / 10) + 1
      res.status(200).json({ images: results, total: total_pages })
      break
    }
      
    case 'get-tag': {
      const tag = body.tag
      const page = parseInt(body.page)
      const results = await ImageBank.tag(tag, page)
      const count = await ImageBank.count_tag(tag)
      const total_pages = Math.trunc((count - 1) / 10) + 1
      res.status(200).json({ images: results, total: total_pages })
      break
    }
      
    case 'get-tags': {
      const results = await ImageBank.tags_all()
      res.status(200).json({ tags: results })
      break
    }
      
    default: 
      res.status(404).end()
    }
  })
}
