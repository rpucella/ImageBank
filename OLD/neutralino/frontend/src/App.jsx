
import 'src/bulma.min.css'
import { useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import { PageContext} from 'src/page-context'
import ScreenDispatch from 'src/screens/dispatch'

const GlobalStyle = createGlobalStyle`
body {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 20px;
}
`

function App() {
  const [page, setPage] = useState({type: 'published', page: 1, url: '/'})
  const newSetPage = (obj) => {
    setPage(obj)
  }
  return (
      <>
      <GlobalStyle />
        <PageContext.Provider value={[page, newSetPage]}>
          <ScreenDispatch />
        </PageContext.Provider>
      </>
  )
}

export default App
