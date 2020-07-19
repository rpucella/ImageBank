import React, {useState, useContext} from 'react'
import {useAsync} from 'react-async'
import styled from 'styled-components'
import axios from 'axios'
import {NavigationContext} from '../navigation-context'
import {Link} from './link'
import {Columns, Column, Content, Field, Control, Buttons, ButtonSmallLink} from './bulma'

const fetchImage = async ({link}) => {
  const { data } = await axios.get('http://localhost:8501' + link, { responseType: 'blob'})
  const result = URL.createObjectURL(data)
  return result
}

const postImagePublish = async (uuid) => { 
  const result = await axios.post('http://localhost:8501/post/publish',
                                   {uid: uuid})
  return result
}
				   
const postImageDraft = async (uuid) => { 
  const result = await axios.post('http://localhost:8501/post/draft',
                                   {uid: uuid})
  return result
}
				   
const LinkImg = styled.img`
  cursor: pointer;
`

const Image = ({img, showButtons}) => {
  const navigateTo = useContext(NavigationContext)
  const { isPending, data, error } = useAsync({promiseFn: fetchImage, link: img.link})
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
        { data && <LinkImg src={data} width="100%" onLoad={() => URL.revokeObjectURL(data)}
                           onClick={() => navigateTo('image', {uuid: img.uuid})} /> }
        { error && <p>ERROR - {JSON.stringify(error)}</p> }
      </Column>
      <Column>
        <Content>
          { img.content.map((line) => <p key={line}>{line}</p>) }
          <Field>
	    <Control>
	      <Buttons>
                { showButtons && <Link onClick={() => navigateTo('edit', {uuid: img.uuid})} className="button is-small is-link" id="button-edit">Edit</Link> }
                { showButtons && draft && 
                    <ButtonSmallLink onClick={clickPublish}> Publish </ButtonSmallLink> }
                { showButtons && !draft && 
                    <ButtonSmallLink onClick={clickDraft}> Draft </ButtonSmallLink> }
                { img.tags.map((t) => <Link key={t} onClick={() => navigateTo('tag', {tag: t})} className="button is-rounded is-small is-link is-light">{t}</Link>) }
              </Buttons>
	    </Control>
	  </Field>
          <div className="dates">
           <p>Created: { img['date_created'] }</p>
           <p>Updated: { img['date_updated'] }</p>
           { img.date_published && <p>Published: { img.date_published }</p> }
	  </div>
        </Content>
      </Column>
    </Columns>
  )
}

export {Image}
