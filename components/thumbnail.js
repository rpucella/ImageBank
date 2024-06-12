
import styled from 'styled-components'
import {useContext} from 'react'
import {PageContext} from '/components/page-context'

const Layout = styled.div`
  flex: 0 0 25%;
  padding: 8px;
`

const LinkImg = styled.img`
  cursor: pointer;
`

export function Thumbnail ({img}) {
  const [_, setPage] = useContext(PageContext)
  return (
    <Layout>
      <LinkImg src={`/api/image/${img.uuid}`} width="100%"
    onClick={() => setPage({type: 'image', uuid: img.uuid, url: '/'})} />
    </Layout>
  )
}
