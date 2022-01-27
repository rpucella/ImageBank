
import {useRouter} from 'next/router'
import {Screen} from '/components/screen'
import {Field, Control, Buttons, TagLink} from '/components/bulma'
import {ImageBank} from '/services/imagebank'

export async function getServerSideProps() {
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

export default function TagsPage({pageData}) {
  const router = useRouter()
  const {tags} = pageData
  return (
        <Screen title={'Tags'}>
          <Field>
            <Control>
              <Buttons>
                { tags.map(t => t.tag).sort().map(tag => <TagLink key={tag} onClick={() => router.push(`/tag/${tag}`)}> { tag } </TagLink>) }
              </Buttons>
            </Control>
          </Field>
        </Screen>
  )
}
