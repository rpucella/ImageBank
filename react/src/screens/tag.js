import React, {useState, useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {navigate} from '@reach/router'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {Pager} from '../components/pager'
import {fetchTag} from '../api'

const ScreenTag = ({tag, page}) => {
  const fetch = useCallback(() => fetchTag(tag, page), [page, tag])
  const state = useAsync({promiseFn: fetch})
  const setPage = (p) => {
    navigate(`/tags/${tag}/${p}`)
  }
  page = parseInt(page)
  return (
    <Screen title={`Tag: ${tag}`}>
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
