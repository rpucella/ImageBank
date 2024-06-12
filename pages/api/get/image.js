
import {ImageBank} from '/services/imagebank'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {uid} = req.query
    const image = await ImageBank.image(uid)
    res.status(200).json({ image })
  }
  else {
    res.status(404).end()
  }
}
