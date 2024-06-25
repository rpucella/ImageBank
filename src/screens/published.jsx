
import {Screen} from 'src/components/screen'
import {Image} from 'src/components/image'
import {Pager} from 'src/components/pager'
import {useState, useEffect} from 'react'
import {usePageContext} from 'src/page-context'
import Api from 'src/api'

export default function PublishedPage({ page }) {
  const [publishedData, setPublishedData] = useState(null)
  const [_, setPage] = usePageContext()
  useEffect(() => {
    (async () => {
      const data = await Api.getPublishedData(page)
      setPublishedData(data)
    })()
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
