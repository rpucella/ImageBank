
import {useRef} from 'react'
import {useRouter} from 'next/router'
import {Screen} from '/components/screen'
import {Field, Control, ButtonLink} from '/components/bulma'
import Api from '/services/api'

async function getServerSideProps() {
  const results = await ImageBank.tags_all()
  const pageData = {
    pagetitle: 'Title',
    tags: results
  }
  return {
    props: {
      pageData
    }
  }
}

export default function AddPage() {
  const router = useRouter()
  const inputEl = useRef(null)
  const urlEl = useRef(null)
  const clickSave = async () => {
    const files = inputEl.current.files;
    if (files.length === 0) {
      return
    }
    if (files.length === 1) {
      const { uid } = await Api.postImageAdd(files[0])
      router.push(`/image/${uid}`)
    }
    else { 
      for (let i = 0; i < files.length; i++) {
        await Api.postImageAdd(files[i])
      }
      router.push('/new')
    }
  }
  const clickSaveURL = async () => {
    const url = urlEl.current.value;
    if (!url || !url.trim()) {
      return
    }
    const { uid } = await Api.postImageAddURL(url)
    router.push(`/image/${uid}`)
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
