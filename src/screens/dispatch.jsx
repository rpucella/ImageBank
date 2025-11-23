import { Screen } from 'src/components/screen'
import { usePageContext } from 'src/page-context'
import AddPage from 'src/screens/add'
import ImagePage from 'src/screens/image'
import NewPage from 'src/screens/new'
import DraftPage from 'src/screens/draft'
import PublishedPage from 'src/screens/published'
import TagPage from 'src/screens/tag'
import TagsPage from 'src/screens/tags'
import EditPage from 'src/screens/edit'

// move to core screen?

export default function ScreenDispatch() {
    console.log('dispatching!')
  const [page, _] = usePageContext()
    console.log(page)
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
  } else {
    return <Screen title='Error'><div>Unknown page type: { page.type || 'null' }</div></Screen>
  }
}
