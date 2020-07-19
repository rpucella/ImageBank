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
import addSvg from './assets/add.svg'
import {Link} from './components/link'

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

const Header = () => {
  const navigateTo = useContext(NavigationContext)
  return (
  <nav className="navbar is-tablet" role="navigation" aria-label="main navigation">

      <div className="navbar-brand">
        <Link className="navbar-item" onClick={() => navigateTo('published')}>
          <span className='logo'>ImageBank</span>
        </Link>

        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        
      </div>
      
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link onClick={() => navigateTo('published')} className="navbar-item"> Published </Link>
          <Link onClick={() => navigateTo('draft')} className="navbar-item"> Drafts </Link>
          <Link onClick={() => navigateTo('new')} className="navbar-item"> New </Link>
          <Link onClick={() => navigateTo('tags')} className="navbar-item"> Tags </Link>
          { /* <Link onClick={() => navigateTo('note')} className="navbar-item"> Notes </Link> */ }
          <Link onClick={() => navigateTo('add')} className="navbar-item"> <span><img src={addSvg} height="12" width="12" /> Image</span> </Link>
        </div>
      </div>
    </nav>
    )
}

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
