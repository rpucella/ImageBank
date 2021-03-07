import axios from 'axios'

const fetchImageRaw = async ({link}) => {
  const { data } = await axios.get('http://localhost:8501' + link, { responseType: 'blob'})
  const result = URL.createObjectURL(data)
  return result
}

const postImagePublish = async (uuid) => { 
  const result = await axios.post('http://localhost:8501/post/publish',
                                   {uid: uuid})
  return result
}
				   
const postImageDraft = async (uuid) => { 
  const result = await axios.post('http://localhost:8501/post/draft',
                                   {uid: uuid})
  return result
}

const postImageAdd = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await axios.post('http://localhost:8501/post/add', formData)
  return data
}

const fetchDraft = async (page) => {
  const { data } = await axios.get(`http://localhost:8501/draft/${page}`)
  return data
}

const fetchImage = async (uuid) => {
  const { data } = await axios.get(`http://localhost:8501/image/${uuid}`)
  return data
}

const postImageEdit = async (uuid, text, tags) => { 
  const result = await axios.post('http://localhost:8501/post/edit',
                                   {uid: uuid, text: text, tags: tags.join(' ;; ')})
  return result
}

const postImageDelete = async (uuid) => { 
  const result = await axios.post('http://localhost:8501/post/delete',
                                  {uid: uuid})
  return result
}

const fetchNew = async (page) => {
  const { data } = await axios.get(`http://localhost:8501/new/${page}`)
  return data
}

const fetchPublished = async (page) => {
  const { data } = await axios.get(`http://localhost:8501/page/${page}`)
  return data
}

const fetchTag = async (tag, page) => {
  const { data } = await axios.get(`http://localhost:8501/tag/${tag}/${page}`)
  return data
}

const fetchTags = async () => {
  const { data } = await axios.get(`http://localhost:8501/tag`)
  return data
}

export {fetchImageRaw, fetchImage, fetchDraft, fetchPublished, fetchNew, fetchTag, fetchTags,
	postImagePublish, postImageDraft, postImageAdd, postImageEdit, postImageDelete}
