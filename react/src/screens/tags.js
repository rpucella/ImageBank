import React, {useContext} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import axios from 'axios'
import {Screen} from '../components/screen'
import {NavigationContext} from '../navigation-context'
import {Field, Control, Buttons, TagLink} from '../components/bulma'

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
            <Field>
              <Control>
                <Buttons>
                  { tags.map(t => t.tag).sort().map(tag => <TagLink key={tag} onClick={() => navigateTo('tag', {tag: tag})}> { tag } </TagLink>) }
                </Buttons>
              </Control>
            </Field>
      )}
    </IfFulfilled>
  </Screen>
  )
}

export {ScreenTags}
