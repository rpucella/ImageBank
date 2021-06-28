import React, {useRef} from 'react'
import {navigate} from '@reach/router'
import {Screen} from '../components/screen'
import {Field, Control, ButtonLink} from '../components/bulma'
import {postImageAdd, postImageAddURL} from '../api'

const ScreenAdd = () => {
  const inputEl = useRef(null)
  const urlEl = useRef(null)
  const clickSave = async () => {
    const files = inputEl.current.files;
    if (files.length === 0) {
      return
    }
    if (files.length === 1) {
      const { uid } = await postImageAdd(files[0])
      navigate(`/image/${uid}/edit`)
    }
    else { 
      for (let i = 0; i < files.length; i++) {
        await postImageAdd(files[i])
      }
      navigate('/new')
    }
  }
  const clickSaveURL = async () => {
    const url = urlEl.current.value;
    if (!url || !url.trim()) {
      return
    }
    const { uid } = await postImageAddURL(url)
    navigate(`/image/${uid}/edit`)
  }
  return (
    <Screen title={'Add Image'}>
      <Field>
        <Control>
          <input className="input" type="file" placeholder="File" ref={inputEl} multiple />
        </Control>
      </Field>
      <Field>
        <Control>
          <ButtonLink onClick={clickSave}> Load </ButtonLink>
        </Control>
      </Field>      
      <Field style={{marginTop: '2rem'}}>
        <Control>
          <input className="input" type="text" placeholder="URL" ref={urlEl} />
        </Control>
      </Field>
      <Field>
        <Control>
          <ButtonLink onClick={clickSaveURL}> Load URL </ButtonLink>
        </Control>
      </Field>      
    </Screen>
  )
}

export {ScreenAdd}
