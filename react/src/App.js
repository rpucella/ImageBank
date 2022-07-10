import React, {useState} from 'react'
import styled from 'styled-components'
import './bulma.min.css'
import './global.css'
import {Router, Redirect} from '@reach/router'
import {ScreenPublished} from './screens/published'
import {ScreenDraft} from './screens/draft'
import {ScreenTags} from './screens/tags'
import {ScreenTag} from './screens/tag'
import {ScreenNew} from './screens/new'
import {ScreenImage} from './screens/image'
import {ScreenEdit} from './screens/edit'
import {ScreenAdd} from './screens/add'
import {Header} from './components/header'

const App = () => {
  return (
    <>
      <Header />
      <Router>
	<ScreenPublished path="/published/:page" />
	<ScreenDraft path="/draft/:page" />
	<ScreenNew path="/new/:page" />
	<ScreenTags path="/tag" />
	<ScreenTag path="/tag/:tag/:page" />
	<ScreenImage path="/image/:uuid" />
	<ScreenEdit path="/image/:uuid/edit" />
	<ScreenAdd path="/add" />
	<Redirect from="/" to="/published/1" />
	<Redirect from="/new" to="/new/1" />
	<Redirect from="/published" to="/published/1" />
	<Redirect from="/draft" to="/draft/1" />
	<Redirect from="/tag/:tag" to="/tag/:tag/1" />
      </Router>
    </>
  )
}

export default App
