import Page from '../Page'
import Feed from '../Feed'
import NewPostButton from '../NewPostButton'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'

const UserPostsPage = () => {
  const { moreToLoad, loadMore, posts } = useUserPosts({ type: 'post' })

  return (
    <Page pageTitle="Posts">
      <h1>Posts</h1>
      <NewPostButton />
      <Feed moreToLoad={moreToLoad} onLoadMore={loadMore} posts={posts} />
    </Page>
  )
}

export default UserPostsPage
