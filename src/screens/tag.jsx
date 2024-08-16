
import {Screen} from 'src/components/screen'
import {Image} from 'src/components/image'
import {Pager} from 'src/components/pager'
import {useState, useEffect} from 'react'
import {usePageContext} from 'src/page-context'
import {useApiContext} from 'src/api-context'

export default function TagPage({ tag, page }) {
  const [tagData, setTagData] = useState(null)
  const [_, setPage] = usePageContext()
  const Api = useApiContext()
  useEffect(() => {
    (async () => {
      const data = await Api.getTagData(tag, page)
      setTagData(data)
    })()
  }, [tag, page])
  if (!tagData) {
    return null
  }
  const { images, total } = tagData
  const go = (p) => {
    setPage({type: 'tag', tag: tag, page: p, url: '/'})
  }
  return (
        <Screen title={`Tag: ${tag}`}>
          <Pager page={page} setPage={go} total={total} />
          { images.map((img) => <Image key={img.uuid} img={img} />) }
          <Pager page={page} setPage={go} total={total} />
        </Screen>
  )
}
