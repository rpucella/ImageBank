import React, {useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import styled from 'styled-components'
import {navigate} from '@reach/router'
import {Screen} from '../components/screen'
import {Pager} from '../components/pager'
import {Thumbnail} from '../components/thumbnail'
import {fetchNew} from '../api'

const Board = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`

const ScreenNew = ({page}) => {
  const fetch = useCallback(() => fetchNew(page), [page])
  const state = useAsync({promiseFn: fetch})
  const setPage = (p) => {
    navigate(`/new/${p}`)
  }
  page = parseInt(page)
  return (
    <Screen title={'New'}>
      <IfFulfilled state={state}>
	{ ({images, total})  => (
          <>
            <Pager page={page} setPage={setPage} total={total} />
	    <Board>  
              { images.map((img) => <Thumbnail key={img.uuid} img={img} />) }
	    </Board>
            <Pager page={page} setPage={setPage} total={total} />
          </>
	)}
      </IfFulfilled>
    </Screen>
  )
}

export {ScreenNew}
