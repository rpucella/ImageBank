// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {ImageBank} from '/services/imagebank'

export default async function handler(req, res) {
  const {uuid} = req.query
  const img = await ImageBank.image(uuid, true)
  res.setHeader('Content-Type', img.mime)
  res.status(200)
  res.end(img.image)
}
