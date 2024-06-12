
import 'bulma.min.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { createGlobalStyle } from 'styled-components'
import { PageContext} from 'page-context'

const GlobalStyle = createGlobalStyle`
body {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 20px;
}

`

function MyApp({ Component, pageProps }) {
  const [page, setPage] = useState({type: 'published', page: 1, url: '/'})
  const router = useRouter()
  const newSetPage = (obj) => {
    setPage(obj)
  }
  return (
      <>
      <GlobalStyle />
        <PageContext.Provider value={[page, newSetPage]}>
          <Component {...pageProps} />
        </PageContext.Provider>
      </>
  )
}

export default MyApp
