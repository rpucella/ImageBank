import React, {useRef, useContext} from 'react'
import axios from 'axios'
import {Screen} from '../components/screen'
import {NavigationContext} from '../navigation-context'
import {Field, Control, ButtonLink} from '../components/bulma'

const postImageAdd = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await axios.post('http://localhost:8501/post/add', formData)
  return data
}

const ScreenAdd = () => {
  const navigateTo = useContext(NavigationContext)
  const inputEl = useRef(null)
  const clickSave = async () => {
    const files = inputEl.current.files;
    if (files.length === 0) {
      return;
    }
    if (files.length === 1) {
      const { uid } = await postImageAdd(files[0])
      navigateTo('edit', {uuid: uid})
    }
    else { 
      for (let i = 0; i < files.length; i++) {
        await postImageAdd(files[i])
      }
      navigateTo('new')
    }
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
    </Screen>
  )
}

export {ScreenAdd}
