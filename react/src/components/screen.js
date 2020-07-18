import React from 'react'
import styled from 'styled-components'

const ScreenLayout = styled.div`
  margin: 16px;
`

const Title = styled.div`
  font-size: 225%;
  margin-bottom: 16px;
`

const Screen = ({title, children}) => (
  <ScreenLayout>
    <Title>{title}</Title>
    { children }
  </ScreenLayout>
)

export {Screen}
