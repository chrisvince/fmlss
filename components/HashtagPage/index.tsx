import Page from '../Page'
import Feed from '../Feed'
import useHashtagPosts from '../../utils/data/posts/useHashtagPosts'

type PropTypes = {
  hashtag: string
}

const HashtagPage = ({ hashtag }: PropTypes) => {
  const title = `#${hashtag}`
  const { posts } = useHashtagPosts(hashtag)
  return (
    <Page pageTitle={title}>
      <h1>{title}</h1>
      <Feed posts={posts} />
    </Page>
  )
}

export default HashtagPage
