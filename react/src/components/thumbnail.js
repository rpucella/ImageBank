import React, {useState, useContext} from 'react'
import {useAsync} from 'react-async'
oimport styled from 'styled-components'
import axios from 'axios'
import {NavigationContext} from '../navigation-context'
import {Link} from './link'

const fetchImage = async ({link}) => {
  const { data } = await axios.get('http://localhost:8501' + link, { responseType: 'blob'})
  const result = URL.createObjectURL(data)
  return result
}

const Layout = styled.div`
  flex: 0 0 25%;
  padding: 8px;
`

const Thumbnail = ({img}) => {
  const navigateTo = useContext(NavigationContext)
  const { isPending, data, error } = useAsync({promiseFn: fetchImage, link: img.link})
  return  <Layout>
    { data && <img src={data} width="100%" onLoad={() => URL.revokeObjectURL(data)} /> }
    { error && <p>ERROR - {JSON.stringify(error)}</p> }
  </Layout>
}

export {Thumbnail}