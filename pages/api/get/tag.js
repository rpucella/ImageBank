
import {ImageBank} from '/services/imagebank'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const tag = req.query.tag
    console.log('looking for tag = ', tag)
    const page = parseInt(req.query.page)
    const results = await ImageBank.tag(tag, page)
    console.log(results)
    const count = await ImageBank.count_tag(tag)
    const total_pages = Math.trunc((count - 1) / 10) + 1
    res.status(200).json({ images: results, total: total_pages })
  }
  else {
    res.status(404).end()
  }
}
