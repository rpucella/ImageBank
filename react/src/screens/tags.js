import React, {useContext} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import axios from 'axios'
import {Screen} from '../components/screen'
import {NavigationContext} from '../navigation-context'

const fetchTags = async () => {
  const { data } = await axios.get(`http://localhost:8501/tag`)
  return data
}

const ScreenTags = () => {
  const state = useAsync({promiseFn: fetchTags})
  const navigateTo = useContext(NavigationContext)
  return (
  <Screen title={'Tags'}>
    <IfFulfilled state={state}>
      { ({tags})  => (
            <div className="field">
              <div className="control">
                <div className="buttons">
                  { tags.map(t => t.tag).sort().map(tag => <div key={tag} onClick={() => navigateTo('tag', {tag: tag})} className="button is-rounded is-link is-light">{ tag }</div>) }
                </div>
              </div>
            </div>
      )}
    </IfFulfilled>
  </Screen>
  )
}

export {ScreenTags}
