import {useState} from 'react'
import styled from 'styled-components'
//import addSvg from '/public//assets/add.svg'
import Link from 'next/link'

const Logo = styled.span`
  font-weight: bold;
  font-size: 150%;
  font-variant: small-caps;
  cursor: pointer;
`

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)
  const goTo = (dest) => () => { setShowMenu(false); navigate(dest) }
  return (
    <nav className="navbar is-tablet" role="navigation" aria-label="main navigation">

      <div className="navbar-brand">
        <Link href="/published/1">
          <Logo  className="navbar-item">ImageBank</Logo>
        </Link>

      <a role="button" className={showMenu ? "navbar-burger is-active" : "navbar-burger"} aria-label="menu" aria-expanded="false" data-target="navbarMenu" onClick={toggleMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        
      </div>
      
      <div id="navbarMenu" className={showMenu ? "navbar-menu is-active" : "navbar-menu"}>
        <div className="navbar-start">
          <Link href="/published/1"><a  className="navbar-item">Published</a></Link>
          <Link href="/draft/1"><a className="navbar-item">Drafts</a></Link>
          <Link href="/new/1"><a className="navbar-item">New</a></Link>
          <Link href="/tag"><a className="navbar-item">Tags</a></Link>
          <Link href="/add"><a className="navbar-item"><span><img src="/assets/add.svg" height="12" width="12" /> Image</span></a></Link>
        </div>
      </div>
    </nav>
    )
}

