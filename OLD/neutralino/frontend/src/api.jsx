import axios from 'axios'
import {extensions, events} from "@neutralinojs/lib"

const extension = "imagebank_backend"
const event = "eventToExtension"

class ApiImpl {

  // RPC over websocket idea from:
  // https://github.com/small-tech/site.js-websocket-rpc-example/blob/master/readme.md

  constructor() {
    ///console.log('creating websocket')
      /*
    const websocket = new WebSocket("/api", "ws")
    this.websocket = websocket
    websocket.onerror = (event) => {
      console.dir(event, {depth:null})
    }
    this.isReady = new Promise((resolve) => {
      websocket.onopen = (event) => {
        resolve(true)
      }
    })
    */
    this.callId = 0
    //console.log('initialized')
  }

  async call(type, obj) {
    const callId = this.callId
    this.callId += 1
    const response = new Promise((resolve) => {
      const listener = (event) => {
        ///console.dir(event, {depth:null})
        const data = event.detail
        if (data.callId === callId) {
          events.off('eventFromExtension', listener)
          resolve(data)
        }
      }
      events.on('eventFromExtension', listener)
    })
    ///console.log('about to send data')
    await extensions.dispatch(extension, event, {...obj, type, callId})
    const data = await response
    ///console.log('received data')
    return data
  }

  async postCall(type, obj) {
    const formData = this.createForm({...obj, type})
    const { data } = await axios.post('/api', formData)
    return data
  }

  createForm(obj) {
    const formData = new FormData()
    formData.append('body', JSON.stringify(obj))
    return formData
  }
  
  async postImagePublish(uuid) {
    return await this.call('post-publish', {uid: uuid})
  }
  
  async postImageDraft(uuid) {
    return await this.call('post-draft', {uid: uuid })
  }

  async postImageAdd(fileObj) {
    return await this.call('post-add' , {file: fileObj})
  }

  async postImageAddURL(url) {
    return await this.call('post-url', {url})
  }

  async postImageEdit(uuid, text, tags) {
    return await this.call('post-edit', {uid: uuid, text: text, tags: tags.join(' ;; ')})
  }

  async postImageDelete(uuid) {
    return await this.call('post-delete', {uid: uuid})
  }

  async getImageData(uuid) {
    return await this.call('get-image', {uid: uuid})
  }

  async getImage(uuid) {
    return await this.call('get-image-raw', {uid: uuid})
  }

  async getNewData(page) {
    return await this.call('get-new', { page })
  }

  async getDraftData(page) {
    return await this.call('get-draft', { page })
  }

  async getPublishedData(page) {
    return await this.call('get-published', { page })
  }

  async getTagData(tag, page) {
    return await this.call('get-tag', { tag, page })
  }

  async getTagsData() {
    return await this.call('get-tags', {})
  }
}

const Api = new ApiImpl()

export default Api

