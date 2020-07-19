import React, {useState} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import axios from 'axios'
import {Screen} from '../components/screen'
import {Image} from '../components/image'

const Pager = () => <p>Pager</p>

const fetchPublished = async ({page}) => {
  const { data } = await axios.get(`http://localhost:8501/page/${page}`)
  return data
}

const ScreenPublished = () => {
  const { page, setPage } = useState(1)
  const state = useAsync({promiseFn: fetchPublished, page: page})
    
  const images = []
  return (
  <Screen title={'Published'}>
    <IfFulfilled state={state}>
      { ({images})  => (
          <>
            <Pager page={page} />
            { images.map((img) => <Image key={img.uuid} img={img} />) }
            <Pager page={page} />
          </>
      )}
    </IfFulfilled>
    }
  </Screen>
  )
}

export {ScreenPublished}
