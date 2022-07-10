
import '/styles/bulma.min.css'

import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
body {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 20px;
}

`

function MyApp({ Component, pageProps }) {
  return (
      <>
      <GlobalStyle />
      <Component {...pageProps} />
      </>
  )
}

export default MyApp
