
import {Screen} from '/components/screen'
import {Image} from '/components/image'
import {Pager} from '/components/pager'
import {useRouter} from 'next/router'
import {ImageBank} from '/services/imagebank'

export async function getServerSideProps({ params }) {
  const page = parseInt(params.page)
  const results = await ImageBank.drafts(page)
  const count = await ImageBank.count_drafts()
  const total_pages = Math.trunc((count - 1) / 10) + 1
  const pageData = {
    page,
    images: results,
    total: total_pages
  }
  return {
    props: {
      pageData
    }
  }
}

export default function DraftsPage({ pageData }) {
  const router = useRouter()
  const { page, images, total } = pageData
  const setPage = (p) => {
    router.push(`/draft/${p}`)
  }
  return (
        <Screen title={'Drafts'}>
          <Pager page={page} setPage={setPage} total={total} />
          { images.map((img) => <Image key={img.uuid} img={img} />) }
          <Pager page={page} setPage={setPage} total={total} />
        </Screen>
  )
}
