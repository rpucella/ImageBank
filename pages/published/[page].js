
import {Screen} from '/components/screen'
import {Image} from '/components/image'
import {Pager} from '/components/pager'
import {Header} from '/components/header'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {ImageBank} from '/services/imagebank'

export async function getServerSideProps({ params }) {
  const page = parseInt(params.page)
  const results = await ImageBank.page(page)
  const count = await ImageBank.count()
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

export default function PublishedPage({ pageData }) {
  const router = useRouter()
  const { page, images, total } = pageData
  const setPage = (p) => {
    router.push(`/published/${p}`)
  }
  return (
      <Screen title={'Published'}>
        <Pager page={page} setPage={setPage} total={total} />
        { images.map((img) => <Image key={img.uuid} img={img} />) }
        <Pager page={page} setPage={setPage} total={total} />
      </Screen>
  )
}
