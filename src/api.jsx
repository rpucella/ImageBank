import axios from 'axios'

class ApiImpl {

  createForm(obj) {
    const formData = new FormData()
    formData.append('body', JSON.stringify(obj))
    return formData
  }
  
  async postImagePublish(uuid) {
    const formData = this.createForm({ type: 'post-publish', uid: uuid })
    const { data } = await axios.post('/api', formData)
    return data
  }
  
  async postImageDraft(uuid) { 
    const formData = this.createForm({ type: 'post-draft', uid: uuid })
    const { data } = await axios.post('/api', formData)
    return data
  }

  async postImageAdd(file) {
    const formData = this.createForm({ type: 'post-add' })
    formData.append('file', file)
    const { data } = await axios.post('/api', formData)
    return data
  }

  async postImageAddURL(url) {
    const formData = this.createForm({ type: 'post-url', url})
    const { data } = await axios.post('/api', formData)
    return data
  }

  async postImageEdit(uuid, text, tags) { 
    const formData = this.createForm({ type: 'post-edit', uid: uuid, text: text, tags: tags.join(' ;; ')})
    const { data } = await axios.post('/api', formData)
    return data
  }

  async postImageDelete(uuid) { 
    const formData = this.createForm({ type: 'post-delete', uid: uuid})
    const { data } = await axios.post('/api', formData)
    return data
  }

  async getImageData(uuid) {
     const formData = this.createForm({ type: 'get-image', uid: uuid})
    const { data } = await axios.post(`/api`, formData)
    return data
  }

  async getImage(uuid) {
    const formData = this.createForm({ type: 'get-image-raw', uuid })
    const { data } = await axios.post(`/api`, formData, { responseType: 'blob'})
    const blob = URL.createObjectURL(new Blob([data]))
    return blob
  }

  async getNewData(page) {
    const formData = this.createForm({ type: 'get-new', page })
    const { data } = await axios.post(`/api`, formData)
    return data
  }

  async getDraftData(page) {
    const formData = this.createForm({ type: 'get-draft', page })
    const { data } = await axios.post(`/api`, formData)
    return data
  }

  async getPublishedData(page) {
    const formData = this.createForm({ type: 'get-published', page })
    const { data } = await axios.post(`/api`, formData)
    return data
  }

  async getTagData(tag, page) {
    const formData = this.createForm({ type: 'get-tag', tag, page })
    const { data } = await axios.post(`/api`, formData)
    return data
  }

  async getTagsData() {
    const formData = this.createForm({ type: 'get-tags' })
    const { data } = await axios.post(`/api`, formData)
    return data
  }
}

const Api = new ApiImpl()

export default Api

