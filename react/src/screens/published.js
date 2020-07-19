import React, {useState, useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import axios from 'axios'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {Pager} from '../components/pager'

const fetchPublished = async (page) => {
  const { data } = await axios.get(`http://localhost:8501/page/${page}`)
  return data
}

const ScreenPublished = () => {
  const [ page, setPage ] = useState(1)
  const fetch = useCallback(() => fetchPublished(page), [page])
  const state = useAsync({promiseFn: fetch})
  return (
  <Screen title={'Published'}>
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

export {ScreenPublished}
