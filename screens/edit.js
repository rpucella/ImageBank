
import {useState, useEffect, useContext} from 'react'
import {Screen} from '/components/screen'
import {Image} from '/components/image'
import {Columns, ColumnOneThird, Column, Field, Control, Buttons, ButtonLink, Tag} from '/components/bulma'
import {PageContext} from '/components/page-context'
import Api from '/services/api'

const TextEdit = ({value, onChange}) => {
  return <textarea className="textarea" value={value} rows={12} onChange={onChange} />
}

const Edit = ({img}) => {
  const [imageData, setImageData] = useState(null)
  const [_, setPage] = useContext(PageContext)
  const [ text, setText ] = useState(img.content.join('\n\n'))
  const [ tags, setTags ] = useState(img.tags)
  const [ dialog, setDialog ] = useState(false)
  const [ tag, setTag ] = useState('')
  useEffect(async () => {
    const data = await Api.getImageData(img.uuid)
    setImageData(data)
  }, [img])
  if (!imageData) {
    return null
  }
  const {image} = imageData
  const handleTextChange = (event) => setText(event.target.value)
  const handleTagChange = (event) => setTag(event.target.value)
  const saveImage = async () => {
    await Api.postImageEdit(img.uuid, text, tags)
    setPage({type: 'image', uuid: img.uuid, url: '/'})
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

export default function EditPage({image}) {
  return (
    <Screen title={'Edit Image'}>
      <Edit key={image.uuid} img={image} />
    </Screen>
  )
}


