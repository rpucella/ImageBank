
import {Screen} from '/components/screen'
import {Image} from '/components/image'
import {Pager} from '/components/pager'
import {useState, useEffect, useContext} from 'react'
import {PageContext} from '/components/page-context'
import Api from '/services/api'

export default function PublishedPage({ page }) {
  const [publishedData, setPublishedData] = useState(null)
  const [_, setPage] = useContext(PageContext)
  useEffect(async () => {
    const data = await Api.getPublishedData(page)
    setPublishedData(data)
  }, [page])
  if (!publishedData) {
    return null
  }
  const { images, total } = publishedData
  const go = (p) => {
    setPage({type: 'published', page: p, url: '/'})
  }
  return (
        <Screen title={'Published'}>
          <Pager page={page} setPage={go} total={total} />
          { images.map((img) => <Image key={img.uuid} img={img} />) }
          <Pager page={page} setPage={go} total={total} />
        </Screen>
  )
}
