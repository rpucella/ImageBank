
import {Screen} from 'components/screen'
import {Image} from 'components/image'
import {Pager} from 'components/pager'
import {useState, useEffect} from 'react'
import {usePageContext} from 'page-context'
import Api from 'api'

export default function DraftPage({ page }) {
  const [draftData, setDraftData] = useState(null)
  const [_, setPage] = usePageContext()
  useEffect(async () => {
    const data = await Api.getDraftData(page)
    setDraftData(data)
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
