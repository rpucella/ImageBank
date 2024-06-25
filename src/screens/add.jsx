
import {useRef} from 'react'
import {Screen} from 'src/components/screen'
import {Field, Control, ButtonLink} from 'src/components/bulma'
import Api from 'src/api'
import {usePageContext} from 'src/page-context'

export default function AddPage() {
  const [_, setPage] = usePageContext()
  const inputEl = useRef(null)
  const urlEl = useRef(null)
  const clickSave = async () => {
    const files = inputEl.current.files;
    if (files.length === 0) {
      return
    }
    if (files.length === 1) {
      const { uid } = await Api.postImageAdd(files[0])
      setPage({type: 'image', uuid: uid, url: '/'})
    }
    else { 
      for (let i = 0; i < files.length; i++) {
        await Api.postImageAdd(files[i])
      }
      setPage({type: 'new', page: 1, url: '/'})
    }
  }
  const clickSaveURL = async () => {
    const url = urlEl.current.value;
    if (!url || !url.trim()) {
      return
    }
    const { uid } = await Api.postImageAddURL(url)
    setPage({type: 'image', uuid: uid, url: '/'})
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
