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
}

const Api = new ApiImpl()

export default Api

