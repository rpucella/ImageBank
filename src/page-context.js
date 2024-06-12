import { createContext, useContext } from 'react'

export const PageContext = createContext([{type: 'published', page: 1, url: '/'}, () => {}])

export const usePageContext = () => {
  const [page, setPage] = useContext(PageContext)
  return [page, setPage]
}

// Maybe distinguish between useScreen() and useGoScreen() to return current screen + goto function?
