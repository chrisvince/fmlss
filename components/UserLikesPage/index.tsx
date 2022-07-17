import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'

const UserLikesPage = () => {
  const { moreToLoad, loadMore, posts } = useUserLikes()

  return (
    <Page
      pageTitle="Likes"
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

export default UserLikesPage
