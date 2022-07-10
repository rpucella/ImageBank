
import {ImageBank} from '/services/imagebank'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {url} = req.body
    const uid = await ImageBank.add_image_url(url)
    res.status(200).json({ uid })
  }
  else {
    res.status(404).end()
  }
}
