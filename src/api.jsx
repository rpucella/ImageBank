import axios from 'axios'

class ApiImpl {

  // RPC over websocket idea from:
  // https://github.com/small-tech/site.js-websocket-rpc-example/blob/master/readme.md

  constructor() {
    ///console.log('creating websocket')
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
    this.callId = 0
  }

  async call(type, obj) {
    ///const formData = this.createForm({...obj, type})
    await this.isReady
    const websocket = this.websocket
    const callId = this.callId
    this.callId += 1
    const response = new Promise((resolve) => {
      const listener = (event) => {
        const data = JSON.parse(event.data)
        if (data.callId === callId) {
          websocket.removeEventListener('message', listener)
          resolve(data)
        }
      }
      websocket.addEventListener('message', listener)
    })
    //const { data } = await axios.post('/api', formData)
    ///console.log('sending socket message')
    websocket.send(JSON.stringify({...obj, type, callId}))
    ///console.log('waiting on', response)
    const data = await response
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

