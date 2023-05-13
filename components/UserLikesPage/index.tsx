import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'
import constants from '../../constants'

const { CATEGORIES_ENABLED } = constants

const UserLikesPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts } = useUserLikes()

  return (
    <Page
      description="See posts you've liked on Fameless"
      pageTitle="Likes"
      renderPageTitle
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          {CATEGORIES_ENABLED && <MiniCategoriesSection />}
        </>
      }
    >
      <Feed
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default UserLikesPage
