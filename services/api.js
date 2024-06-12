import axios from 'axios'

class ApiImpl {
  
  async postImagePublish(uuid) { 
    const result = await axios.post('/api/post/publish',
                                    {uid: uuid})
    return result
  }
  
  async postImageDraft(uuid) { 
    const result = await axios.post('/api/post/draft',
                                    {uid: uuid})
    return result
  }

  async postImageAdd(file) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axios.post('/api/post/add', formData)
    return data
  }

  async postImageAddURL(url) {
    const { data } = await axios.post('/api/post/url',
				      {url})
    return data
  }

  async postImageEdit(uuid, text, tags) { 
    const result = await axios.post('/api/post/edit',
                                    {uid: uuid, text: text, tags: tags.join(' ;; ')})
    return result
  }

  async postImageDelete(uuid) { 
    const result = await axios.post('/api/post/delete',
                                    {uid: uuid})
    return result
  }

  async getImageData(uuid) {
    const { data } = await axios.get(`/api/get/image?uid=${uuid}`)
    return data
  }

  async getNewData(page) {
    const { data } = await axios.get(`/api/get/new?page=${page}`)
    return data
  }

  async getDraftData(page) {
    const { data } = await axios.get(`/api/get/draft?page=${page}`)
    return data
  }

  async getPublishedData(page) {
    const { data } = await axios.get(`/api/get/published?page=${page}`)
    return data
  }

  async getTagData(tag, page) {
    const { data } = await axios.get(`/api/get/tag?tag=${tag}&page=${page}`)
    return data
  }

  async getTagsData() {
    const { data } = await axios.get(`/api/get/tags`)
    return data
  }
}

const Api = new ApiImpl()

export default Api

