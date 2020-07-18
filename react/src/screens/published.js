import React from 'react'
import {Screen} from '../components/screen'

const Pager = () => <p>Pager</p>

const ScreenPublished = () => {
  const images = []
  return (
  <Screen title={'Published'}>
    <Pager />
    { images.map((img) => <div key={img.key}>Image</div>) }
    <Pager />
  </Screen>
  )
}

export {ScreenPublished}
