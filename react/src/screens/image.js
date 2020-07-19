import React, {useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {fetchImage} from '../api'

const ScreenImage = ({uuid}) => {
  const fetch = useCallback(() => fetchImage(uuid), [uuid])
  const state = useAsync({promiseFn: fetch})
  return (
  <Screen title={'Image ' + uuid}>
    <IfFulfilled state={state}>
      { ({image}) => <Image key={image.uuid} img={image} showButtons={true} /> }
    </IfFulfilled>
  </Screen>
  )
}

export {ScreenImage}
