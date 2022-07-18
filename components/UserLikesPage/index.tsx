import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'

const UserLikesPage = () => {
  const { cacheKey, isLoading, loadMore, moreToLoad, posts } = useUserLikes()

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
      <Feed
        cacheKey={cacheKey}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default UserLikesPage
