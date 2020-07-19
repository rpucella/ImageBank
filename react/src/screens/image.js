import React, {useState, useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import axios from 'axios'
import {Screen} from '../components/screen'
import {Image} from '../components/image'

const fetchImage = async (uuid) => {
  const { data } = await axios.get(`http://localhost:8501/image/${uuid}`)
  return data
}

const ScreenImage = ({uuid}) => {
  const [ page, setPage ] = useState(1)
  const fetch = useCallback(() => fetchImage(uuid), [uuid])
  const state = useAsync({promiseFn: fetch})
  return (
  <Screen title={'Image ' + uuid}>
    <IfFulfilled state={state}>
      { ({image}) => <Image key={image.uuid} img={image} /> }
    </IfFulfilled>
  </Screen>
  )
}

export {ScreenImage}
