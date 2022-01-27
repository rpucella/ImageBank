
import {Screen} from '/components/screen'
import {Image} from '/components/image'
import {Pager} from '/components/pager'
import {useRouter} from 'next/router'
import {ImageBank} from '/services/imagebank'

export async function getServerSideProps({ params }) {
  const tag = params.tag
  const page = parseInt(params.page)
  const results = await ImageBank.tag(tag, page)
  const count = await ImageBank.count_tag(tag)
  const total_pages = Math.trunc((count - 1) / 10) + 1
  const pageData = {
    tag,
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

export default function TagPage({ pageData }) {
  const router = useRouter()
  const { tag, page, images, total } = pageData
  const setPage = (p) => {
    router.push(`/tag/${tag}/${p}`)
  }
  return (
        <Screen title={`Tag: ${tag}`}>
          <Pager page={page} setPage={setPage} total={total} />
          { images.map((img) => <Image key={img.uuid} img={img} />) }
          <Pager page={page} setPage={setPage} total={total} />
        </Screen>
  )
}

