import Page from '../Page'
import Feed from '../Feed'
import NewPostButton from '../NewPostButton'
import usePostFeed from '../../utils/data/posts/usePostFeed'

const HomePage = () => {
  const { posts } = usePostFeed()

  return (
    <Page pageTitle="Home">
      <h1>Home</h1>
      <NewPostButton />
      <Feed posts={posts} />
    </Page>
  )
}

export default HomePage
