
import styled from 'styled-components'
import {Screen} from '/components/screen'
import {Thumbnail} from '/components/thumbnail'
import {Pager} from '/components/pager'
import {useRouter} from 'next/router'
import {ImageBank} from '/services/imagebank'

const Board = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`
export async function getServerSideProps({ params }) {
  const page = parseInt(params.page)
  const results = await ImageBank.drafts_new(page)
  const count = await ImageBank.count_new()
  const total_pages = Math.trunc((count - 1) / 16) + 1
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

export default function NewPage({ pageData }) {
  const router = useRouter()
  const { page, images, total } = pageData
  const setPage = (p) => {
    router.push(`/new/${p}`)
  }
  return (
        <Screen title={'New'}>
            <Pager page={page} setPage={setPage} total={total} />
	    <Board>  
              { images.map((img) => <Thumbnail key={img.uuid} img={img} />) }
	    </Board>
            <Pager page={page} setPage={setPage} total={total} />
        </Screen>
  )
}
