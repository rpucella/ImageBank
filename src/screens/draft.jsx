
import {Screen} from 'src/components/screen'
import {Image} from 'src/components/image'
import {Pager} from 'src/components/pager'
import {useState, useEffect} from 'react'
import {usePageContext} from 'src/page-context'
import Api from 'src/api'

export default function DraftPage({ page }) {
  const [draftData, setDraftData] = useState(null)
  const [_, setPage] = usePageContext()
  useEffect(() => {
    (async () => {
      const data = await Api.getDraftData(page)
      setDraftData(data)
    })()
  }, [page])
  if (!draftData) {
    return null
  }
  const { images, total } = draftData
  const go = (p) => {
    setPage({type: 'draft', page: p, url: '/'})
  }
  return (
        <Screen title={'Drafts'}>
          <Pager page={page} setPage={go} total={total} />
          { images.map((img) => <Image key={img.uuid} img={img} />) }
          <Pager page={page} setPage={go} total={total} />
        </Screen>
  )
}
