
import {ImageBank} from '/services/imagebank'

export default async function handler(req, res) {
  if (req.method === 'POST') { 
    const {uid} = req.body
    await ImageBank.publish_image(uid)
    res.status(200).json({ uid })
  }
  else {
    res.status(404).end()
  }
}
