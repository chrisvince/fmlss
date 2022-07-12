import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'

const UserPostsPage = () => {
  const { moreToLoad, loadMore, posts } = useUserPosts({ type: 'post' })

  return (
    <Page pageTitle="Posts">
      <Feed moreToLoad={moreToLoad} onLoadMore={loadMore} posts={posts} />
    </Page>
  )
}

export default UserPostsPage
