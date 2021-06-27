import React, {useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {navigate} from '@reach/router'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {Pager} from '../components/pager'
import {fetchDraft} from '../api'

const ScreenDraft = ({page}) => {
  const fetch = useCallback(() => fetchDraft(page), [page])
  const state = useAsync({promiseFn: fetch})
  const setPage = (p) => {
    navigate(`/draft/${p}`)
  }
  page = parseInt(page)
  return (
  <Screen title={'Drafts'}>
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
