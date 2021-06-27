import React from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {navigate} from '@reach/router'
import styled from 'styled-components'
import {fetchImageRaw} from '../api'

const Layout = styled.div`
  flex: 0 0 25%;
  padding: 8px;
`

const LinkImg = styled.img`
  cursor: pointer;
`

const Thumbnail = ({img}) => {
  const state  = useAsync({promiseFn: fetchImageRaw, link: img.link})
  return  <Layout>
    <IfFulfilled state={state}>
      { src => <LinkImg src={src} width="100%" onLoad={() => URL.revokeObjectURL(src)}
                        onClick={() => navigate(`/image/${img.uuid}`)} /> }
    </IfFulfilled>
  </Layout>
}

export {Thumbnail}
