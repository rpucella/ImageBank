
import {Screen} from '/components/screen'
import {Field, Control, Buttons, TagLink} from '/components/bulma'
import {useState, useEffect, useContext} from 'react'
import {PageContext} from '/components/page-context'
import Api from '/services/api'

export default function TagsPage() {
  const [tagsData, setTagsData] = useState(null)
  const [_, setPage] = useContext(PageContext)
  useEffect(async () => {
    const data = await Api.getTagsData()
    setTagsData(data)
  }, [])
  if (!tagsData) {
    return null
  }
  const {tags} = tagsData
  return (
        <Screen title={'Tags'}>
          <Field>
            <Control>
              <Buttons>
      { tags.map(t => t.tag).sort().map(tag => <TagLink key={tag} onClick={() => setPage({type: 'tag', tag: tag, page: 1, url: '/'})}> { tag } </TagLink>) }
              </Buttons>
            </Control>
          </Field>
        </Screen>
  )
}
