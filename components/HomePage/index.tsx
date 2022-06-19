import Page from '../Page'
import Feed from '../Feed'
import NewPostButton from '../NewPostButton'
import usePostFeed from '../../utils/data/posts/usePostFeed'

const HomePage = () => {
  const { moreToLoad, loadMore, posts } = usePostFeed()

  return (
    <Page pageTitle="Home">
      <h1>Home</h1>
      <NewPostButton />
      <Feed
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default HomePage
