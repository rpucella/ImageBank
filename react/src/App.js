import React, {useState} from 'react'
import styled from 'styled-components'
import './bulma.min.css'
import {ScreenPublished} from './screens/published'
import addSvg from './assets/add.svg'

const _SCREENS = {
  published: ScreenPublished
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

const Link = styled.div`
  cursor: pointer;
`

const Header = ({screen, setScreen}) => {
  const navigateTo = (newScreen) => () => setScreen(newScreen)
  return (
  <nav className="navbar is-tablet" role="navigation" aria-label="main navigation">

      <div className="navbar-brand">
        <Link className="navbar-item" onClick={navigateTo('published')}>
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
          <Link onClick={navigateTo('published')} className="navbar-item"> Published </Link>
          <Link onClick={navigateTo('draft')} className="navbar-item"> Drafts </Link>
          <Link onClick={navigateTo('new')} className="navbar-item"> New </Link>
          <Link onClick={navigateTo('tag')} className="navbar-item"> Tags </Link>
          <Link onClick={navigateTo('note')} className="navbar-item"> Notes </Link>
          <Link onClick={navigateTo('add')} className="navbar-item"> <span><img src={addSvg} height="12" width="12" /> Image</span> </Link>
        </div>
      </div>
    </nav>
    )
}

const App = () => {
    const [screen, setScreen] = useState('published')
    const Screen = _SCREENS[screen] || Error(screen)
    return <>
      <Header screen={screen} setScreen={setScreen} />
      <Screen />
    </>
}

export default App
