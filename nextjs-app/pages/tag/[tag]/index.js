import { useRouter } from 'next/router'

function RedirectPage({ tag }) {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(`/tag/${tag}/1`)
    return null
  }
}

RedirectPage.getInitialProps = ({query, res}) => {
  // We check for ctx.res to make sure we're on the server.
  if (res) {
    res.writeHead(302, { Location: `/tag/${query.tag}/1` });
    res.end();
  }
  return {
      tag: query.tag
  };
}

export default RedirectPage
