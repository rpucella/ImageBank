
import {Screen} from 'components/screen'
import {Image} from 'components/image'
import {Pager} from 'components/pager'
import {useState, useEffect} from 'react'
import {usePageContext} from 'page-context'
import Api from 'api'

export default function TagPage({ tag, page }) {
  const [tagData, setTagData] = useState(null)
  const [_, setPage] = usePageContext()
  useEffect(async () => {
    const data = await Api.getTagData(tag, page)
    setTagData(data)
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
