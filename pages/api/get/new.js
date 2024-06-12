
import {ImageBank} from '/services/imagebank'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page)
    const results = await ImageBank.drafts_new(page)
    const count = await ImageBank.count_new()
    const total_pages = Math.trunc((count - 1) / 16) + 1
    res.status(200).json({ images: results, total: total_pages })
  }
  else {
    res.status(404).end()
  }
}
