import React, {useState, useContext} from 'react'
import styled from 'styled-components'
import {NavigationContext} from '../navigation-context'
import {Link} from './link'
import addSvg from '../assets/add.svg'

const Logo = styled.span`
  font-weight: bold;
  font-size: 130%;
  font-variant: small-caps;
`

export const Header = () => {
  const navigateTo = useContext(NavigationContext)
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)
  const goTo = (dest) => () => { setShowMenu(false); navigateTo(dest) }
  return (
    <nav className="navbar is-tablet" role="navigation" aria-label="main navigation">

      <div className="navbar-brand">
        <Link className="navbar-item" onClick={goTo('published')}>
          <Logo>ImageBank</Logo>
        </Link>

      <a role="button" className={showMenu ? "navbar-burger is-active" : "navbar-burger"} aria-label="menu" aria-expanded="false" data-target="navbarMenu" onClick={toggleMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        
      </div>
      
      <div id="navbarMenu" className={showMenu ? "navbar-menu is-active" : "navbar-menu"}>
        <div className="navbar-start">
          <Link onClick={goTo('published')} className="navbar-item"> Published </Link>
          <Link onClick={goTo('draft')} className="navbar-item"> Drafts </Link>
          <Link onClick={goTo('new')} className="navbar-item"> New </Link>
          <Link onClick={goTo('tags')} className="navbar-item"> Tags </Link>
          { /* <Link onClick={goTo('note')} className="navbar-item"> Notes </Link> */ }
          <Link onClick={goTo('add')} className="navbar-item"> <span><img src={addSvg} height="12" width="12" /> Image</span> </Link>
        </div>
      </div>
    </nav>
    )
}

