import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'

const UserRepliesPage = () => {
  const { moreToLoad, loadMore, posts } = useUserPosts({ type: 'reply' })

  return (
    <Page pageTitle="Replies">
      <h1>Replies</h1>
      <Feed moreToLoad={moreToLoad} onLoadMore={loadMore} posts={posts} />
    </Page>
  )
}

export default UserRepliesPage
