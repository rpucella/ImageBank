import axios from 'axios'

const fetchImageRaw = async ({link}) => {
  const { data } = await axios.get('/api' + link, { responseType: 'blob'})
  const result = URL.createObjectURL(data)
  return result
}

const postImagePublish = async (uuid) => { 
  const result = await axios.post('/api/post/publish',
                                   {uid: uuid})
  return result
}
				   
const postImageDraft = async (uuid) => { 
  const result = await axios.post('/api/post/draft',
                                   {uid: uuid})
  return result
}

const postImageAdd = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await axios.post('/api/post/add', formData)
  return data
}

const fetchDraft = async (page) => {
  const { data } = await axios.get(`/api/draft/${page}`)
  return data
}

const fetchImage = async (uuid) => {
  const { data } = await axios.get(`/api/image/${uuid}`)
  return data
}

const postImageEdit = async (uuid, text, tags) => { 
  const result = await axios.post('/api/post/edit',
                                   {uid: uuid, text: text, tags: tags.join(' ;; ')})
  return result
}

const postImageDelete = async (uuid) => { 
  const result = await axios.post('/api/post/delete',
                                  {uid: uuid})
  return result
}

const fetchNew = async (page) => {
  const { data } = await axios.get(`/api/new/${page}`)
  return data
}

const fetchPublished = async (page) => {
  const { data } = await axios.get(`/api/page/${page}`)
  return data
}

const fetchTag = async (tag, page) => {
  const { data } = await axios.get(`/api/tag/${tag}/${page}`)
  return data
}

const fetchTags = async () => {
  const { data } = await axios.get(`/api/tag`)
  return data
}

export {fetchImageRaw, fetchImage, fetchDraft, fetchPublished, fetchNew, fetchTag, fetchTags,
	postImagePublish, postImageDraft, postImageAdd, postImageEdit, postImageDelete}
