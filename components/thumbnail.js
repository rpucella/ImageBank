
import styled from 'styled-components'
import {useRouter} from 'next/router'

const Layout = styled.div`
  flex: 0 0 25%;
  padding: 8px;
`

const LinkImg = styled.img`
  cursor: pointer;
`

export function Thumbnail ({img}) {
  const router = useRouter()
  return (
    <Layout>
      <LinkImg src={`/api/image/${img.uuid}`} width="100%"
               onClick={() => router.push(`/image/${img.uuid}`)} />
    </Layout>
  )
}
