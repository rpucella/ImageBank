import {useState} from 'react'
import styled from 'styled-components'
//import addSvg from '/public//assets/add.svg'
import {usePageContext} from '../page-context'

const Logo = styled.span`
  font-weight: bold;
  font-size: 150%;
  font-variant: small-caps;
  cursor: pointer;
`

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const toggleMenu = () => setShowMenu(!showMenu)
  const [_, setPage] = usePageContext()
  const go = (obj) => () => {
    setPage(obj)
  }
  return (
    <nav className="navbar is-tablet" role="navigation" aria-label="main navigation">

      <div className="navbar-brand">
      <Logo  className="navbar-item" onClick={go({type: "published", page: 1, url: "/"})}>ImageBank</Logo>

      <a role="button" className={showMenu ? "navbar-burger is-active" : "navbar-burger"} aria-label="menu" aria-expanded="false" data-target="navbarMenu" onClick={toggleMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        
      </div>
      
      <div id="navbarMenu" className={showMenu ? "navbar-menu is-active" : "navbar-menu"}>
        <div className="navbar-start">
          <a  className="navbar-item" onClick={go({type: 'published', page: 1, url: '/'})}>Completed</a>
          <a  className="navbar-item" onClick={go({type: 'draft', page: 1, url: '/'})}>Drafts</a>
          <a  className="navbar-item" onClick={go({type: 'new', page: 1, url: '/'})}>Bank</a>
          <a  className="navbar-item" onClick={go({type: 'tags', url: '/'})}>Tags</a>
          <a  className="navbar-item" onClick={go({type: 'add', url: '/'})}><span><img src="/assets/add.svg" height="12" width="12" /> Image</span></a>
        </div>
      </div>
    </nav>
    )
}

