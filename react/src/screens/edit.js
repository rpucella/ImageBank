import React, {useState, useCallback, useContext} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {Screen} from '../components/screen'
import {NavigationContext} from '../navigation-context'
import {Columns, ColumnOneThird, Column, Field, Control, Buttons, ButtonLink, Tag} from '../components/bulma'
import {fetchImage, fetchImageRaw, postImage} from '../api'

const TextEdit = ({value, onChange}) => {
  return <textarea className="textarea" value={value} rows={12} onChange={onChange} />
}

const Edit = ({img}) => {
  const navigateTo = useContext(NavigationContext)
  const state = useAsync({promiseFn: fetchImageRaw, link: img.link})
  const [ text, setText ] = useState(img.text)
  const [ tags, setTags ] = useState(img.tags)
  const handleTextChange = (event) => setText(event.target.value)
  const save = async () => {
    await postImage(img.uuid, text, tags)
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
              <Tag key={t} data-tag={t}> {t}&nbsp;&nbsp;<button className="delete ib-delete" onClick={() => deleteTag(t)}></button> </Tag>) }
            </Buttons>
          </Control>
        </Field>
      </Column>
    </Columns>
  )  
}

const ScreenEdit = ({uuid}) => {
  const fetch = useCallback(() => fetchImage(uuid), [uuid])
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
