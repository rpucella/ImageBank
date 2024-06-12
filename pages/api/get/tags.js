
import {ImageBank} from '/services/imagebank'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const results = await ImageBank.tags_all()
    res.status(200).json({ tags: results })
  }
  else {
    res.status(404).end()
  }
}
