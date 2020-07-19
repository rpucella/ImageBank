import React, {useState, useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import styled from 'styled-components'
import axios from 'axios'
import {Screen} from '../components/screen'
import {Pager} from '../components/pager'
import {Thumbnail} from '../components/thumbnail'

const fetchNew = async (page) => {
  const { data } = await axios.get(`http://localhost:8501/new/${page}`)
  return data
}

const Board = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`

const ScreenNew = () => {
  const [ page, setPage ] = useState(1)
  const fetch = useCallback(() => fetchNew(page), [page])
  const state = useAsync({promiseFn: fetch})
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
