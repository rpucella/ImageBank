import {useState, useCallback, useEffect} from 'react'
import styled from 'styled-components'
import {usePageContext} from '../page-context'
import {Columns, Column, Content, Field, Control, Buttons, ButtonSmallDanger, ButtonSmallLink, TagSmallLink} from './bulma'
import Api from '../api'
import {useImage} from '../use-image'

function pad2(n) {
  return n.toString().padStart(2, '0')
}

function formatDate(dstr) {
  if (dstr) {
    const d = new Date(dstr)
    const dt = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
    const tm = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
    return dt + ' (' + tm + ')'
  }
  else {
    return ''
  }
}

const LinkImg = styled.img`
  cursor: pointer;
`

const Dates = styled.div`
  margin-top: 32px;
  font-size: 60%;
  display: flex;
  flex-direction: column;
`

const DateLineLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const DateItem = styled.div`
  margin-left: 8px;
  width: 10em;
`

const TextItem = styled.div`
  margin: 0 8px;
`

const DateLine = ({text, date}) => {
  return (
    <DateLineLayout>
      <TextItem>{text}:</TextItem>
      <DateItem>{formatDate(date)}</DateItem>
    </DateLineLayout>
  )
}

const Image = ({img, extended}) => {
  // Attribute extended = show buttons + dates
  const image = useImage(img)
  const [ draft, setDraft ] = useState(img.draft)
  const [ confirmDelete, setConfirmDelete ] = useState(false)
  const [_, setPage] = usePageContext()
  const deleteDialog = () => {
    setConfirmDelete(true)
  }
  const deleteImage = async () => {
    setConfirmDelete(false)
    await Api.postImageDelete(img.uuid)
    // get back to default?
    setPage({type: 'published', page: 1, url: '/'})
  }
  const clickPublish = async () => {
    await Api.postImagePublish(img.uuid)
    setDraft(false)
  }
  const clickDraft = async () => {
    await Api.postImageDraft(img.uuid)
    setDraft(true)  
  }
  if (!image) {
    return null
  }
  //console.log(img.mime)
  //console.log(image)
  return (
    <>
    <Columns>
      <Column>
           <LinkImg src={image}  width="100%" 
                 onClick={() => setPage({type: 'image', uuid: img.uuid, url: '/'})} />
      </Column>
      <Column>
        <Content>
          { img.content.map((line, i) => <p key={line + i}>{line}</p>) }
          <Field>
	    <Control>
	      <Buttons>
                { extended && <a className="button is-small is-link" id="button-edit" onClick={() => setPage({type: 'edit', image: img, url: '/'})}>Edit</a> }
                { extended && draft && 
                  <ButtonSmallLink onClick={clickPublish}> Publish </ButtonSmallLink> }
                { extended && !draft && 
                  <ButtonSmallLink onClick={clickDraft}> Draft </ButtonSmallLink> }
                { extended && draft &&
                  <ButtonSmallDanger onClick={deleteDialog}> Delete </ButtonSmallDanger> }
                { img.tags.map((t) => <TagSmallLink key={t} onClick={() => setPage({type: 'tag', tag: t, page: 1, url: '/'})}> {t} </TagSmallLink>) }
              </Buttons>
	    </Control>
	  </Field>
          { extended && <Dates>
                          <DateLine text="Created" date={img.date_created} />
                          <DateLine text="Updated" date={img.date_updated} />
                          { img.date_published && <DateLine text="Published" date={img.date_published} /> }
	                </Dates> }
        </Content>
      </Column>
    </Columns>
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
    </>
  )
}

export {Image}
