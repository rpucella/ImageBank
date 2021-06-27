import React, {useState, useCallback} from 'react'
import {useAsync, IfFulfilled} from 'react-async'
import {navigate} from '@reach/router'
import {Screen} from '../components/screen'
import {Columns, ColumnOneThird, Column, Field, Control, Buttons, ButtonLink, ButtonDanger, Tag} from '../components/bulma'
import {fetchImage, fetchImageRaw, postImageEdit, postImageDelete} from '../api'

const TextEdit = ({value, onChange}) => {
  return <textarea className="textarea" value={value} rows={12} onChange={onChange} />
}

const Edit = ({img}) => {
  const state = useAsync({promiseFn: fetchImageRaw, link: img.link})
  const [ text, setText ] = useState(img.text)
  const [ tags, setTags ] = useState(img.tags)
  const [ dialog, setDialog ] = useState(false)
  const [ confirmDelete, setConfirmDelete ] = useState(false)
  const [ tag, setTag ] = useState('')
  
  const handleTextChange = (event) => setText(event.target.value)
  const handleTagChange = (event) => setTag(event.target.value)
  const saveImage = async () => {
    await postImageEdit(img.uuid, text, tags)
    navigate(`/image/${img.uuid}`)
  }
  const deleteDialog = () => {
    setConfirmDelete(true)
  }
  const deleteImage = async () => {
    setConfirmDelete(false)
    await postImageDelete(img.uuid)
    // get back to default?
    navigate('/published')
  }
  const addTagDialog = () => {
    setTag('')
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
              <ButtonLink onClick={saveImage}> Save </ButtonLink>
              <ButtonLink onClick={addTagDialog}> Add Tag </ButtonLink>
              { tags.map(t => 
              <Tag key={t} data-tag={t}> {t}&nbsp;&nbsp;<button className="delete ib-delete" onClick={() => deleteTag(t)}></button> </Tag>) }
              <ButtonDanger onClick={deleteDialog}> Delete </ButtonDanger>
            </Buttons>
          </Control>
        </Field>
      </Column>
    </Columns>
    <div className={dialog ? "modal is-active" : "modal"}>
      <div className="modal-background" onClick={() => setDialog(false)}></div>
      <div className="modal-content">
        <div className="box">

          <div className="field">
            <label className="label">Tag:</label>
            <div className="control">
              <input className="input" value={tag} type="text" onChange={handleTagChange} />
            </div>
          </div>
      
          <div className="field is-grouped mt-6">
            <div className="control">
              <button className="button is-link" onClick={addTag}>OK</button>
            </div>
            <div className="control">
              <button className="button is-light" onClick={() => setDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className={confirmDelete ? "modal is-active" : "modal"}>
      <div className="modal-background" onClick={() => setConfirmDelete(false)}></div>
      <div className="modal-content">
        <div className="box">

	  <div className="content">
	    <p>Delete image?</p>
	  </div>
	  
          <div className="field is-grouped mt-6">
            <div className="control">
              <button className="button is-link" onClick={deleteImage}>OK</button>
            </div>
            <div className="control">
              <button className="button is-light" onClick={() => setConfirmDelete(false)}>Cancel</button>
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
