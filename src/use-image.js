import { useState, useEffect } from 'react'
import Api from 'api'

export const useImage = (img) => {
  const [data, setData] = useState(null)
  useEffect(async () => {
    const data = await Api.getImage(img.uuid)
    setData(`data:${img.mime};base64,${Buffer.from(data).toString('base64')}`)
  }, [img])
  return data
}

