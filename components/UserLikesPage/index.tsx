import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'
import constants from '../../constants'

const { CATEGORIES_ENABLED, CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } =
  constants

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

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
        cellMeasurerCache={cellMeasurerCache}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
        type="post"
      />
    </Page>
  )
}

export default UserLikesPage
