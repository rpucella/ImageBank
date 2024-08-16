import { useState, useEffect } from 'react'
import {useApiContext} from 'src/api-context'

export const useImage = (img) => {
  const [data, setData] = useState(null)
  const Api = useApiContext()
  useEffect(() => {
    (async () => {
      const data = await Api.getImage(img.uuid)
      setData(data.image)   // `data:${img.mime};base64,${Buffer.from(data).toString('base64')}`)
    }) ()
  }, [img])
  return data
}

