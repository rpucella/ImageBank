
import styled from 'styled-components'
import Head from 'next/head'
import {Header} from './header'

const ScreenLayout = styled.div`
  margin: 16px 40px;
  display: flex;
  flex-direction: row;
`

const Column = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  max-width: 1200px;
  width: 1200px;
`

const Title = styled.div`
  font-size: 225%;
  margin-bottom: 16px;
`

export const Screen = ({title, pageTitle, children}) => {
  const ptitle = pageTitle || title
  return (
    <>
      <Head>
        <title>ImageBank | {ptitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main>
        <Header />
        <ScreenLayout>
          <Column>
            { title && <Title>{title}</Title> }
            { children }
          </Column>
        </ScreenLayout>
      </main>
    </>
  )
}
