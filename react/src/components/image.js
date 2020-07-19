import React, {useState, useContext} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import styled from 'styled-components'
import {NavigationContext} from '../navigation-context'
import {Link} from './link'
import {Columns, Column, Content, Field, Control, Buttons, ButtonSmallLink, TagSmallLink} from './bulma'
import {fetchImageRaw, postImagePublish, postImageDraft} from '../api'

const LinkImg = styled.img`
  cursor: pointer;
`

const Dates = styled.div`
  margin-top: 32px;
  font-size: 75%;
`

const Image = ({img, showButtons}) => {
  const navigateTo = useContext(NavigationContext)
  const state = useAsync({promiseFn: fetchImageRaw, link: img.link})
  const [ draft, setDraft ] = useState(img.draft)
  const clickPublish = async () => {
    await postImagePublish(img.uuid)
    setDraft(false)
  }
  const clickDraft = async () => {
    await postImageDraft(img.uuid)
    setDraft(true)  
  }
  return (
    <Columns>
      <Column>
        <IfFulfilled state={state}>
	  { src => <LinkImg src={src} width="100%" onLoad={() => URL.revokeObjectURL(src)}
                            onClick={() => navigateTo('image', {uuid: img.uuid})} /> }
        </IfFulfilled>
      </Column>
      <Column>
        <Content>
          { img.content.map((line, i) => <p key={line + i}>{line}</p>) }
          <Field>
	    <Control>
	      <Buttons>
                { showButtons && <Link onClick={() => navigateTo('edit', {uuid: img.uuid})} className="button is-small is-link" id="button-edit">Edit</Link> }
                { showButtons && draft && 
                    <ButtonSmallLink onClick={clickPublish}> Publish </ButtonSmallLink> }
                { showButtons && !draft && 
                    <ButtonSmallLink onClick={clickDraft}> Draft </ButtonSmallLink> }
                { img.tags.map((t) => <TagSmallLink key={t} onClick={() => navigateTo('tag', {tag: t})}> {t} </TagSmallLink>) }
              </Buttons>
	    </Control>
	  </Field>
          <Dates>
           <p>Created: { img['date_created'] }</p>
           <p>Updated: { img['date_updated'] }</p>
           { img.date_published && <p>Published: { img.date_published }</p> }
	  </Dates>
        </Content>
      </Column>
    </Columns>
  )
}

export {Image}
