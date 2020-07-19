import React, {useState, useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import axios from 'axios'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {Pager} from '../components/pager'

const fetchDraft = async (page) => {
  const { data } = await axios.get(`http://localhost:8501/draft/${page}`)
  return data
}

const ScreenDraft = () => {
  const [ page, setPage ] = useState(1)
  const fetch = useCallback(() => fetchDraft(page), [page])
  const state = useAsync({promiseFn: fetch})
  return (
  <Screen title={'Draft'}>
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

export {ScreenDraft}
