import React, {useState, useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {Pager} from '../components/pager'
import {fetchTag} from '../api'

const ScreenTag = ({tag}) => {
  const [ page, setPage ] = useState(1)
  const fetch = useCallback(() => fetchTag(tag, page), [page, tag])
  const state = useAsync({promiseFn: fetch})
  return (
  <Screen title={'Tag: ' + tag}>
    <IfFulfilled state={state}>
      { ({images, total})  => (
          <>
            <Pager page={page} setPage={setPage} total={total} />
            { images.map((img) => <Image key={img.uuid} img={img} />) }
            <Pager page={page} setPage={setPage} total={total} />
          </>
      )}
    </IfFulfilled>
  </Screen>
  )
}

export {ScreenTag}
