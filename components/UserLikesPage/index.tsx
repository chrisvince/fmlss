import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'

const UserLikesPage = () => {
  const { moreToLoad, loadMore, posts } = useUserLikes()

  return (
    <Page pageTitle="Likes">
      <h1>Likes</h1>
      <Feed moreToLoad={moreToLoad} onLoadMore={loadMore} posts={posts} />
    </Page>
  )
}

export default UserLikesPage
