
import {ImageBank} from '/services/imagebank'

export default async function handler(req, res) {
  if (req.method === 'POST') { 
    const {uid, text, tags} = req.body
    const ntags = tags ? tags.split(' ;; ') : []
    const ntext = text.replace(/\r/g, '').split('\n\n').map(t => t.trim());
    await ImageBank.edit_image(uid, ntext, ntags)
    res.status(200).json({ uid })
  }
  else {
    res.status(404).end()
  }
}
