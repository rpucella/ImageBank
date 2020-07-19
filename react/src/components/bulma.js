import React from 'react'
import styled from 'styled-components'

// styled components abstracting away some bulma junk

const Columns = styled.div.attrs({className: 'columns'})``

const ColumnOneThird = styled.div.attrs({className: 'column is-one-third'})``

const Column = styled.div.attrs({className: 'column'})``

const Field = styled.div.attrs({className: 'field'})``

const Control = styled.div.attrs({className: 'control'})``

const Buttons = styled.div.attrs({className: 'buttons'})``

const ButtonLink = styled.div.attrs({className: 'button is-link'})``

export {Columns, ColumnOneThird, Column, Field, Control, Buttons, ButtonLink}
