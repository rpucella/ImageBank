import React, {useContext} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import styled from 'styled-components'
import {NavigationContext} from '../navigation-context'
import {fetchImageRaw} from '../api'

const Layout = styled.div`
  flex: 0 0 25%;
  padding: 8px;
`

const LinkImg = styled.img`
  cursor: pointer;
`

const Thumbnail = ({img}) => {
  const navigateTo = useContext(NavigationContext)
  const state  = useAsync({promiseFn: fetchImageRaw, link: img.link})
  return  <Layout>
    <IfFulfilled state={state}>
      { src => <LinkImg src={src} width="100%" onLoad={() => URL.revokeObjectURL(src)}
                        onClick={() => navigateTo('image', {uuid: img.uuid})} /> }
    </IfFulfilled>
  </Layout>
}

export {Thumbnail}
