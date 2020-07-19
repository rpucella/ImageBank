import React, {useContext} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import styled from 'styled-components'
import axios from 'axios'
import {NavigationContext} from '../navigation-context'

const fetchImage = async ({link}) => {
  const { data } = await axios.get('http://localhost:8501' + link, { responseType: 'blob'})
  const result = URL.createObjectURL(data)
  return result
}

const Layout = styled.div`
  flex: 0 0 25%;
  padding: 8px;
`

const LinkImg = styled.img`
  cursor: pointer;
`

const Thumbnail = ({img}) => {
  const navigateTo = useContext(NavigationContext)
  const state  = useAsync({promiseFn: fetchImage, link: img.link})
  return  <Layout>
    <IfFulfilled state={state}>
      { src => <LinkImg src={src} width="100%" onLoad={() => URL.revokeObjectURL(src)}
                        onClick={() => navigateTo('image', {uuid: img.uuid})} /> }
    </IfFulfilled>
  </Layout>
}

export {Thumbnail}
