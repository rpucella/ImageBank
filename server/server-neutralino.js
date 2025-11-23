import {ImageBank} from './imagebank.js'
import {v4 as uuidv4} from 'uuid'
import formidable from 'formidable'

import process from 'process'
import fs from 'fs'
import WebSocket from 'ws'

const processInput = JSON.parse(fs.readFileSync(process.stdin.fd, 'utf-8'))
const NL_PORT = processInput.nlPort
const NL_TOKEN = processInput.nlToken
const NL_CTOKEN = processInput.nlConnectToken
const NL_EXTID = processInput.nlExtensionId
const NL_URL =  `ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}&connectToken=${NL_CTOKEN}`

async function processMsg(body) {
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

// From https://neutralino.js.org/docs/how-to/extensions-overview

console.log(`Connecting to ${NL_URL}`)

const client = new WebSocket(NL_URL)

client.on('error', (error) => {
    log(`Connection error!`, "ERROR")
    console.dir(error, {depth:null})
})
client.on('open', () => log(`Connected`))
client.on('close', (code, reason) => {
  log(`WebSocket closed: ${code} - ${reason}`);
  process.exit()
})
client.on('message', async (evt) => {
  const evtData = evt.toString('utf-8')
  const { event, data } = JSON.parse(evtData)

  if (event === "eventToExtension") {
    const callId = data.callId
    const result = await processMsg(data)
    ///console.dir(result, {depth:null})
    client.send(JSON.stringify({
      id: uuidv4(),
      method: "app.broadcast",
      accessToken: NL_TOKEN,
      data: {
        event: "eventFromExtension",
        data: {...result, callId}
      }
    }))
 }
})

function log(message, type = "INFO") {
  const logLine = `[${NL_EXTID}]: ${message}`
  console[type === "INFO" ? "log" : "error"](logLine)
}
