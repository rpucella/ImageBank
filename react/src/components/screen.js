import React from 'react'
import styled from 'styled-components'

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

const Screen = ({title, children}) => (
  <ScreenLayout>
    <Column>
      <Title>{title}</Title>
      { children }
    </Column>
  </ScreenLayout>
)

export {Screen}
