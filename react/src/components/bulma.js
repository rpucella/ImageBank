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

const Content = styled.div.attrs({className: 'content'})``

const ButtonSmallLink = styled.div.attrs({className: 'button is-small is-link'})``

const TagLink = styled.div.attrs({className: 'button is-rounded is-link is-light'})``

const TagSmallLink = styled.div.attrs({className: 'button is-rounded is-link is-light is-small'})``

const Tag = styled.div.attrs({className: 'button is-static is-rounded is-light'})``

export {Columns, ColumnOneThird, Column, Field, Control, Buttons, ButtonLink, Content, ButtonSmallLink,
	TagLink, TagSmallLink, Tag}

