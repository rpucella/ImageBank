import React from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {navigate} from '@reach/router'
import {Screen} from '../components/screen'
import {Field, Control, Buttons, TagLink} from '../components/bulma'
import {fetchTags} from '../api'

const ScreenTags = () => {
  const state = useAsync({promiseFn: fetchTags})
  return (
  <Screen title={'Tags'}>
    <IfFulfilled state={state}>
      { ({tags})  => (
            <Field>
              <Control>
                <Buttons>
                  { tags.map(t => t.tag).sort().map(tag => <TagLink key={tag} onClick={() => navigate(`/tag/${tag}`)}> { tag } </TagLink>) }
                </Buttons>
              </Control>
            </Field>
      )}
    </IfFulfilled>
  </Screen>
  )
}

export {ScreenTags}
