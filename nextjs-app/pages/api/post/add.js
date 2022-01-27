
// TODO: Check if formidable-serverless is better?
import formidable from 'formidable'
import {ImageBank} from '/services/imagebank'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm()
    form.uploadDir = '/tmp'
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      console.log(err, fields, files)
      const upload = files.file
      const filename = upload.originalFilename
      const file = upload.filepath
      const uid = await ImageBank.add_image(file, filename)
      res.status(200).json({ uid })
    })
  }
  else {
    res.status(404).end()
  }
}
