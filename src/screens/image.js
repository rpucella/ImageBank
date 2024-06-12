
import {useRef, useState, useEffect} from 'react'
import {useEventListener} from 'use-event-listener'
import {Screen} from 'components/screen'
import {Image} from 'components/image'
import {usePageContext} from 'page-context'
import Api from 'api'

export default function ImagePage({uuid}) {
  const [imageData, setImageData] = useState(null)
  const goPrevious = useRef(null)
  const goNext = useRef(null)
  const [_, setPage] = usePageContext()
  const keyHandler = ({key}) => {
    // Flip arrows so that right goes to "previous" and left goes to "next"
    // because previous and next refer to time, and we want order in the New
    // pages
    if (key == 'ArrowRight' && goPrevious.current?.uuid) {
      setPage({type: 'image', uuid: goPrevious.current.uuid, url: '/'})
    }
    else if (key == 'ArrowLeft' && goNext.current?.uuid) {
      setPage({type: 'image', uuid: goNext.current.uuid, url: '/'})
    }
  }
  useEventListener('keydown', keyHandler)
  useEffect(async () => {
    const data = await Api.getImageData(uuid)
    setImageData(data)
  }, [uuid])
  if (!imageData) {
    return null
  }
  const {image} = imageData
  // yuck...
  goPrevious.current = {uuid: image.previous}
  goNext.current = {uuid: image.next}
  // Previous and Next in time are not what we want here,
  // so flip!
  const imageNextOK = !!image.previous
  const imagePreviousOK = !!image.next
  const imageNext = image.previous || ''
  const imagePrevious = image.next || ''
  const go = (uid) => () => {
    if (!uid) {
      return
    }
    setPage({type: 'image', uuid: uid, url: '/'})
  }
  return (
    <Screen pageTitle="Image">
      <nav className="pagination" role="navigation" aria-label="pagination">
      <a className="pagination-previous" disabled={!imagePreviousOK} onClick={go(imagePrevious)}> Previous</a>
      <a className="pagination-next" disabled={!imageNextOK} onClick={go(imageNext)}>Next</a>
      </nav>
      <Image key={image.uuid} img={image} extended={true} />
    </Screen>
  )
}
