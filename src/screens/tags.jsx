
import {Screen} from 'src/components/screen'
import {Field, Control, Buttons, TagLink} from 'src/components/bulma'
import {useState, useEffect} from 'react'
import {usePageContext} from 'src/page-context'
import {useApiContext} from 'src/api-context'

export default function TagsPage() {
  const [tagsData, setTagsData] = useState(null)
  const [_, setPage] = usePageContext()
  const Api = useApiContext()
  useEffect(() => {
    (async () => {
      const data = await Api.getTagsData()
      setTagsData(data)
    })()
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
