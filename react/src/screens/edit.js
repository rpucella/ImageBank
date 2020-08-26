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
  const [ dialog, setDialog ] = useState(false)
  const [ tag, setTag ] = useState('')
  
  const handleTextChange = (event) => setText(event.target.value)
  const handleTagChange = (event) => setTag(event.target.value)
  const save = async () => {
    await postImage(img.uuid, text, tags)
    navigateTo('image', {uuid: img.uuid})
  }
  const addTagDialog = () => {
    setDialog(true)
  }
  const addTag = () => {
    setDialog(false)
    if (!tags.includes(tag)) {
      setTags(tags.concat([tag]))
    }
  }  
  const deleteTag = (tag) => {
    const newTags = tags.filter(t => t !== tag)
    setTags(newTags)
  }
  return (
  <>  
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
              <ButtonLink onClick={addTagDialog}> Add Tag </ButtonLink>
              { tags.map(t => 
              <Tag key={t} data-tag={t}> {t}&nbsp;&nbsp;<button className="delete ib-delete" onClick={() => deleteTag(t)}></button> </Tag>) }
            </Buttons>
          </Control>
        </Field>
      </Column>
    </Columns>
    <div className="modal {{dialog ? "is-active" : ""}}">
      <div className="modal-background" onClick={() => setDialog(false)}></div>
        <div className="modal-content">
          <div className"box">

            <div className"field">
              <label className"label">Tag:</label>
              <div className"control">
                <input className"input" value={tag} type="text" onChange={handleTagChange}>
              </div>
            </div>
      
            <div className"field is-grouped mt-6">
              <div className"control">
                <button className"button is-link" onClick={addTag}>OK</button>
              </div>
              <div className"control">
                <button className"button is-light" onClick={() => setDialog(false)}>Cancel</button>
              </div>
            </div>      
          </div>
        </div>
      </div>
    </div>
  </>)  
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
