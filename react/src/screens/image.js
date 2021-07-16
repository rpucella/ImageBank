import React, {useCallback, useRef} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {navigate} from '@reach/router'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {fetchImage} from '../api'
import {Link} from '../components/link'
import {useEventListener} from '../use-event-listener'

const ScreenImage = ({uuid}) => {
  const fetch = useCallback(() => fetchImage(uuid), [uuid])
  const state = useAsync({promiseFn: fetch})
  const goPrevious = useRef(null)
  const goNext = useRef(null)
  const keyHandler = ({key}) => {
    if (key == 'ArrowLeft' && goPrevious.current?.uuid) {
      navigate(`/image/${goPrevious.current.uuid}`)
    }
    else if (key == 'ArrowRight' && goNext.current?.uuid) {
      navigate(`/image/${goNext.current.uuid}`)
    }
  }
  useEventListener('keydown', keyHandler)
  return (
    <Screen title="">
      <IfFulfilled state={state}>
	{ ({image}) => {
	  // yuck...
	  goPrevious.current = {uuid: image.previous}
	  goNext.current = {uuid: image.next}
	  return (
	    <>
	      <nav className="pagination" role="navigation" aria-label="pagination">
		<Link className="pagination-previous" onClick={() => image.previous && navigate(`/image/${image.previous}`)} disabled={!image.previous}> Previous </Link>
		<Link className="pagination-next" onClick={() => image.next && navigate(`/image/${image.next}`)} disabled={!image.next}> Next </Link>
	      </nav>
	      <Image key={image.uuid} img={image} showButtons={true} />
	    </>
	  )
	}
	}
      </IfFulfilled>
    </Screen>
  )
}

export {ScreenImage}
