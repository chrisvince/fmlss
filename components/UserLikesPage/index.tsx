import Page from '../Page'
import Feed from '../Feed'
import NewPostButton from '../NewPostButton'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'

const HomePage = () => {
  const { moreToLoad, loadMore, posts } = useUserLikes()

  return (
    <Page pageTitle="Likes">
      <h1>Likes</h1>
      <NewPostButton />
      <Feed moreToLoad={moreToLoad} onLoadMore={loadMore} posts={posts} />
    </Page>
  )
}

export default HomePage
