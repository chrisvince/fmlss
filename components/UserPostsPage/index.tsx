import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'

const UserPostsPage = () => {
  const { moreToLoad, loadMore, posts } = useUserPosts({ type: 'post' })

  return (
    <Page
      pageTitle="Posts"
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      <Feed moreToLoad={moreToLoad} onLoadMore={loadMore} posts={posts} />
    </Page>
  )
}

export default UserPostsPage
