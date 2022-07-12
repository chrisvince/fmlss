import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'

const UserLikesPage = () => {
  const { moreToLoad, loadMore, posts } = useUserLikes()

  return (
    <Page pageTitle="Likes">
      <Feed moreToLoad={moreToLoad} onLoadMore={loadMore} posts={posts} />
    </Page>
  )
}

export default UserLikesPage
