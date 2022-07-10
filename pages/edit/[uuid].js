
import {useState} from 'react'
import {Screen} from '/components/screen'
import {Image} from '/components/image'
import {useRouter} from 'next/router'
import {ImageBank} from '/services/imagebank'
import {Columns, ColumnOneThird, Column, Field, Control, Buttons, ButtonLink, Tag} from '/components/bulma'
import Api from '/services/api'

const TextEdit = ({value, onChange}) => {
  return <textarea className="textarea" value={value} rows={12} onChange={onChange} />
}

export async function getServerSideProps({ params }) {
  const uuid = params.uuid
  const image = await ImageBank.image(uuid)
  const imageData = {
    uuid,
    image
  }
  return {
    props: {
      imageData
    }
  }
}

const Edit = ({img}) => {
  const [ text, setText ] = useState(img.content.join('\n\n'))
  const [ tags, setTags ] = useState(img.tags)
  const [ dialog, setDialog ] = useState(false)
  const [ tag, setTag ] = useState('')
  const router = useRouter()
  const handleTextChange = (event) => setText(event.target.value)
  const handleTagChange = (event) => setTag(event.target.value)
  const saveImage = async () => {
    await Api.postImageEdit(img.uuid, text, tags)
    router.push(`/image/${img.uuid}`)
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
        <img src={`/api/image/${img.uuid}`} width="100%" />
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
  </>)  
}

export default function EditPage({ imageData }) {
  const {image} = imageData
  return (
    <Screen title={'Edit Image'}>
      <Edit key={image.uuid} img={image} />
    </Screen>
  )
}


