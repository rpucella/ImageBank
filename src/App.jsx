
import 'src/bulma.min.css'
import { useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import { PageContext} from 'src/page-context'
import { ApiContext} from 'src/api-context'
import Api from './api'
import ScreenDispatch from 'src/screens/dispatch'

const GlobalStyle = createGlobalStyle`
body {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 20px;
}
`
function App({callObj}) {
  const [page, setPage] = useState({type: 'published', page: 1, url: '/'})
  const newSetPage = (obj) => {
    setPage(obj)
  }
  const apiObj = new Api(callObj)
  console.log(callObj)
  console.log(apiObj)
  return (
      <>
      <GlobalStyle />
        <ApiContext.Provider value={apiObj}>
          <PageContext.Provider value={[page, newSetPage]}>
            <ScreenDispatch />
          </PageContext.Provider>
        </ApiContext.Provider>
      </>
  )
}

export default App
