
class Api {

  // RPC over websocket idea from:
  // https://github.com/small-tech/site.js-websocket-rpc-example/blob/master/readme.md

  constructor(Call) {
    this._Call = Call
    this._callObj = null
  }

  call(url, args) {
    if (!this._callObj) {
      this._callObj = new this._Call()
    }
    return this._callObj.call(url, args)
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

export default Api
