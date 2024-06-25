
import styled from 'styled-components'
import {usePageContext} from '../page-context'
import {useImage} from '../use-image'

const Layout = styled.div`
  flex: 0 0 25%;
  padding: 8px;
`

const LinkImg = styled.img`
  cursor: pointer;
`

export function Thumbnail ({img}) {
  const image = useImage(img)
  const [_, setPage] = usePageContext()
  if (!image) {
    return null
  }
  return (
    <Layout>
      <LinkImg src={image} width="100%"
    onClick={() => setPage({type: 'image', uuid: img.uuid, url: '/'})} />
    </Layout>
  )
}
