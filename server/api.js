import express from 'express'
import 'dotenv/config'
import expressWS from 'express-ws'

import {ImageBank} from './imagebank.js'
import formidable from 'formidable'

const app = express()
expressWS(app)
const port = 8000

// Disable parsing the body as a JSON.
export const config = {
  api: {
    bodyParser: false,
  },
}

async function process(body) {
    ///console.log(err, fields, files)
  ///const body = JSON.parse(fields.body)
    switch(body.type) {

    case 'post-add': {
      //const upload = files.file
      //const filename = upload.originalFilename
      //const file = upload.filepath
      const file = body.file  // base64
      const uid = await ImageBank.add_image(file)
      return { uid }
    }

    case 'post-delete': {
      const {uid} = body
      await ImageBank.delete_image(uid)
      return { uid }
    }

    case 'post-draft': {
      const {uid} = body
      await ImageBank.draft_image(uid)
      return { uid }
    }

    case 'post-edit': {
      const {uid, text, tags} = body
      const ntags = tags ? tags.split(' ;; ') : []
      const ntext = text.replace(/\r/g, '').split('\n\n').map(t => t.trim());
      await ImageBank.edit_image(uid, ntext, ntags)
      return { uid }
    }

    case 'post-publish': {
      const {uid} = body
      await ImageBank.publish_image(uid)
      return { uid }
    }

    case 'post-url': {
      const {url} = body
      const uid = await ImageBank.add_image_url(url)
      return { uid }
    }

    case 'get-draft': {
      const page = parseInt(body.page)
      const results = await ImageBank.drafts(page)
      const count = await ImageBank.count_drafts()
      const total_pages = Math.trunc((count - 1) / 10) + 1
      return { images: results, total: total_pages }
    }

    case 'get-image': {
      const {uid} = body
      const image = await ImageBank.image(uid)
      return { image }
    }

    case 'get-image-raw': {
      const {uid} = body
      const img = await ImageBank.image(uid, true)
      const base64Image = Buffer.from(img.image).toString('base64')
      return { image: `data:${img.mime};base64,${base64Image}` }
    }

    case 'get-new': {
      const page = parseInt(body.page)
      const results = await ImageBank.drafts_new(page)
      const count = await ImageBank.count_new()
      const total_pages = Math.trunc((count - 1) / 16) + 1
      return { images: results, total: total_pages }
      break
    }

    case 'get-published': {
      const page = parseInt(body.page)
      const results = await ImageBank.page(page)
      const count = await ImageBank.count()
      const total_pages = Math.trunc((count - 1) / 10) + 1
      return { images: results, total: total_pages }
    }

    case 'get-tag': {
      const tag = body.tag
      const page = parseInt(body.page)
      const results = await ImageBank.tag(tag, page)
      const count = await ImageBank.count_tag(tag)
      const total_pages = Math.trunc((count - 1) / 10) + 1
      return { images: results, total: total_pages }
    }

    case 'get-tags': {
      const results = await ImageBank.tags_all()
      return { tags: results }
    }

    default:
      return null
    }
}

app.post('/api', async (req, res) => {
  const form = formidable()
  form.uploadDir = '/tmp'
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    const body = JSON.parse(fields.body)
    const result = await process(body)
    if (result) {
       res.status(200).json(result)
    } else {
      res.status(404).end()
    }
  })
})

app.ws('/api', async (ws, req) => {
  ws.on('message', async (msg) => {
    ///console.log('received', msg)
    const obj = JSON.parse(msg)
    const callId = obj.callId
    ///console.log(obj)
    const result = await process(obj)
    ///console.log('`------------------------------------------------------------')
    ///console.log('sending', result)
    ws.send(JSON.stringify({...result, callId}))
  })
  ///console.log('creating socket')
})


app.use(express.static('dist'))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
