import React, {useState, useCallback, useContext} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import styled from 'styled-components'
import axios from 'axios'
import {Screen} from '../components/screen'
import {Image} from '../components/image'
import {NavigationContext} from '../navigation-context'
import {Columns, ColumnOneThird, Column, Field, Control, Buttons, ButtonLink} from '../components/bulma'

const fetchImageMetadata = async (uuid) => {
  const { data } = await axios.get(`http://localhost:8501/image/${uuid}`)
  return data
}

const postImageMetadata = async (uuid, text, tags) => { 
  const result = await axios.post('http://localhost:8501/post/edit',
                                   {uid: uuid, text: text, tags: tags.join(' ;; ')})
  return result
}
				   
const fetchImage = async ({link}) => {
  const { data } = await axios.get('http://localhost:8501' + link, { responseType: 'blob'})
  const result = URL.createObjectURL(data)
  return result
}

const TextEdit = ({value, onChange}) => {
  return <textarea className="textarea" value={value} rows={12} onChange={onChange} />
}

const Edit = ({img}) => {
  const navigateTo = useContext(NavigationContext)
  const state = useAsync({promiseFn: fetchImage, link: img.link})
  const [ text, setText ] = useState(img.text)
  const [ tags, setTags ] = useState(img.tags)
  const handleTextChange = (event) => setText(event.target.value)
  const save = async () => {
    await postImageMetadata(img.uuid, text, tags)
    navigateTo('image', {uuid: img.uuid})
  }
  const addTag = () => {
    const newtag = window.prompt('Tag to add:').trim();
    if (!tags.includes(newtag)) {
      setTags(tags.concat([newtag]))
    }
  }
  const deleteTag = (tag) => {
    const newTags = tags.filter(t => t !== tag)
    setTags(newTags)
  }
  return (
    <Columns>
      <ColumnOneThird>
        <IfFulfilled state={state}>
          { src => <img src={src} width="100%" onLoad={() => URL.revokeObjectURL(src)} /> }
        </IfFulfilled>
      </ColumnOneThird>
      <Column>
        <Field>
          <Control>
            <TextEdit value={text} onChange={handleTextChange} />
          </Control>
        </Field>
        <Field>
          <Control>
            <Buttons>
              <ButtonLink onClick={save}> Save </ButtonLink>
              <ButtonLink onClick={addTag}> Add Tag </ButtonLink>
              { tags.map(t => 
              <span key={t} data-tag={t} className="button is-static is-rounded is-light ib-tag">{t}&nbsp;&nbsp;<button className="delete ib-delete" onClick={() => deleteTag(t)}></button> </span>) }
            </Buttons>
          </Control>
        </Field>
      </Column>
    </Columns>
  )  
}

const ScreenEdit = ({uuid}) => {
  const fetch = useCallback(() => fetchImageMetadata(uuid), [uuid])
  const state = useAsync({promiseFn: fetch})
  return (
  <Screen title={'Edit Image'}>
    <IfFulfilled state={state}>
      { ({image}) => <Edit key={image.uuid} img={image} /> }
    </IfFulfilled>
  </Screen>
  )
}

export {ScreenEdit}
