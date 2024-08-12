
import styled from 'styled-components'
import {Screen} from 'src/components/screen'
import {Thumbnail} from 'src/components/thumbnail'
import {Pager} from 'src/components/pager'
import {useState, useEffect} from 'react'
import {usePageContext} from 'src/page-context'
import Api from 'src/api'

const Board = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`

export default function NewPage({page}) {
  const [newData, setNewData] = useState(null)
  const [_, setPage] = usePageContext()
  useEffect(() => {
    (async () => {
      const data = await Api.getNewData(page)
      setNewData(data)
    })()
  }, [page])
  if (!newData) {
    return null
  }
  const { images, total } = newData
  const go = (p) => {
    setPage({type: 'new', page: p, url: '/'})
  }
  return (
        <Screen title={'Image Bank'}>
            <Pager page={page} setPage={go} total={total} />
	    <Board>  
              { images.map((img) => <Thumbnail key={img.uuid} img={img} />) }
	    </Board>
            <Pager page={page} setPage={go} total={total} />
        </Screen>
  )
}
