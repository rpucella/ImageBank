import { useRouter } from 'next/router'
import { useContext } from 'react'

import { Screen } from '/components/screen'
import { PageContext } from '/components/page-context'
import AddPage from '/screens/add'
import ImagePage from '/screens/image'
import NewPage from '/screens/new'
import DraftPage from '/screens/draft'
import PublishedPage from '/screens/published'
import TagPage from '/screens/tag'
import TagsPage from '/screens/tags'
import EditPage from '/screens/edit'

export default function RedirectPage({ ctx }) {
  const router = useRouter()
  // Make sure we're in the browser
  const [page, _] = useContext(PageContext)
  ///console.log('Navigation:', page)
  if (page.type === 'add') {
    return <AddPage />
  } else if (page.type === 'image') {
    return <ImagePage uuid={page.uuid} />
  } else if (page.type === 'new') {
    return <NewPage page={page.page} />
  } else if (page.type === 'draft') {
    return <DraftPage page={page.page} />
  } else if (page.type === 'published') {
    return <PublishedPage page={page.page} />
  } else if (page.type === 'tag') {
    return <TagPage tag={page.tag} page={page.page} />
  } else if (page.type === 'tags') {
    return <TagsPage />
  } else if (page.type === 'edit') {
    return <EditPage image={page.image} />
  } else if (page.type === 'next') {
    console.log(`About to route to ${page.url}`)
    router.push(page.url)
    return null
  } else {
    return <Screen title='Error'><div>Unknown page type: { page.type || 'null' }</div></Screen>
  }
}
