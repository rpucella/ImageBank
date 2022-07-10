
import {useRef} from 'react'
import {useEventListener} from '/services/use-event-listener'
import {Screen} from '/components/screen'
import {Image} from '/components/image'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {ImageBank} from '/services/imagebank'

export async function getServerSideProps({ params }) {
  const uuid = params.uuid
  const image = await ImageBank.image(uuid)
  const imageData = {
    uuid,
    image
  }
  return {
    props: {
      imageData
    }
  }
}

export default function ImagePage({ imageData }) {
  const router = useRouter()
  const goPrevious = useRef(null)
  const goNext = useRef(null)
  const keyHandler = ({key}) => {
    // Flip arrows so that right goes to "previous" and left goes to "next"
    // because previous and next refer to time, and we want order in the New
    // pages
    if (key == 'ArrowRight' && goPrevious.current?.uuid) {
      router.push(`/image/${goPrevious.current.uuid}`)
    }
    else if (key == 'ArrowLeft' && goNext.current?.uuid) {
      router.push(`/image/${goNext.current.uuid}`)
    }
  }
  useEventListener('keydown', keyHandler)
  const {image, uuid} = imageData
  // yuck...
  goPrevious.current = {uuid: image.previous}
  goNext.current = {uuid: image.next}
  // Previous and Next in time are not what we want here,
  // so flip!
  const imageNextOK = !!image.previous
  const imagePreviousOK = !!image.next
  const imageNext = image.previous || ''
  const imagePrevious = image.next || ''
  return (
    <Screen pageTitle="Image">
      <nav className="pagination" role="navigation" aria-label="pagination">
        <Link href={`/image/${imagePrevious}`}><a className="pagination-previous" disabled={!imagePreviousOK}> Previous</a></Link>
        <Link href={`/image/${imageNext}`}><a className="pagination-next" disabled={!imageNextOK}>Next</a></Link>
      </nav>
      <Image key={image.uuid} img={image} extended={true} />
    </Screen>
  )
}
