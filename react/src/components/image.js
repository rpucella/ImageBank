import React, {useState, useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import styled from 'styled-components'
import {navigate} from '@reach/router'
import {Link} from './link'
import {Columns, Column, Content, Field, Control, Buttons, ButtonSmallLink, TagSmallLink} from './bulma'
import {fetchImageRaw, postImagePublish, postImageDraft} from '../api'
import {formatDate} from '../util'

const LinkImg = styled.img`
  cursor: pointer;
`

const Dates = styled.div`
  margin-top: 32px;
  font-size: 75%;
`

const Image = ({img, showButtons}) => {
  const fetch = useCallback(() => fetchImageRaw(img.uuid), [img.uuid])
  const state = useAsync({promiseFn: fetch})
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
                            onClick={() => navigate(`/image/${img.uuid}`)} /> }
        </IfFulfilled>
      </Column>
      <Column>
        <Content>
          { img.content.map((line, i) => <p key={line + i}>{line}</p>) }
          <Field>
	    <Control>
	      <Buttons>
                { showButtons && <Link onClick={() => navigate(`/image/${img.uuid}/edit`)} className="button is-small is-link" id="button-edit">Edit</Link> }
                { showButtons && draft && 
                  <ButtonSmallLink onClick={clickPublish}> Publish </ButtonSmallLink> }
                { showButtons && !draft && 
                  <ButtonSmallLink onClick={clickDraft}> Draft </ButtonSmallLink> }
                { img.tags.map((t) => <TagSmallLink key={t} onClick={() => navigate(`/tag/${t}`)}> {t} </TagSmallLink>) }
              </Buttons>
	    </Control>
	  </Field>
          <Dates>
            <p>Created: { formatDate(img.date_created) }</p>
            <p>Updated: { formatDate(img.date_updated) }</p>
            { img.date_published && <p>Published: { formatDate(img.date_published) }</p> }
	  </Dates>
        </Content>
      </Column>
    </Columns>
  )
}

export {Image}
