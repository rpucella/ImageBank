import React, {useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {fetchImage} from '../api'
import {Link} from '../components/link'

const ScreenImage = ({uuid}) => {
  const fetch = useCallback(() => fetchImage(uuid), [uuid])
  const state = useAsync({promiseFn: fetch})
  return (
    <Screen title="">
      <nav className="pagination" role="navigation" aria-label="pagination">
	<Link className="pagination-previous" onClick={null} disabled={true}> Previous </Link>
	<Link className="pagination-next" onClick={null} disabled={true}> Next </Link>
      </nav>
      <IfFulfilled state={state}>
	{ ({image}) => <Image key={image.uuid} img={image} showButtons={true} /> }
      </IfFulfilled>
    </Screen>
  )
}

export {ScreenImage}
