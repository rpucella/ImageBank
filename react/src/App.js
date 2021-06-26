import React, {useState, useContext} from 'react'
import styled from 'styled-components'
import './bulma.min.css'
import {NavigationContext} from './navigation-context'
import {ScreenPublished} from './screens/published'
import {ScreenDraft} from './screens/draft'
import {ScreenTags} from './screens/tags'
import {ScreenTag} from './screens/tag'
import {ScreenNew} from './screens/new'
import {ScreenImage} from './screens/image'
import {ScreenEdit} from './screens/edit'
import {ScreenAdd} from './screens/add'
import {Link} from './components/link'
import {Header} from './components/header'

const _SCREENS = {
  published: ScreenPublished,
  draft: ScreenDraft,
  tags: ScreenTags,
  tag: ScreenTag,
  new: ScreenNew,
  image: ScreenImage,
  edit: ScreenEdit,
  add: ScreenAdd
}

const ErrorMessage = styled.div`
  margin: 16px;
  color: red;
`

const Error = (screen) => () => (
  <ErrorMessage>
    Unknown screen: {screen}
  </ErrorMessage>
)

const App = () => {
    const [screenObj, setScreen] = useState({name: 'published', args: {}})
    const navigateTo = (name, args) => setScreen({name: name, args : args || {}})
    const Screen = _SCREENS[screenObj.name] || Error(screenObj.name)
    return (
      <NavigationContext.Provider value={navigateTo}>
        <Header /> 
        <Screen {... screenObj.args} />
      </NavigationContext.Provider>
    )
}

export default App
