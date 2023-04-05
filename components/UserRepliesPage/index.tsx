import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'
import constants from '../../constants'
import PageSpinner from '../PageSpinner'

const {
  CATEGORIES_ENABLED,
  CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
} = constants

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

const UserRepliesPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts } = useUserPosts({
    type: 'reply',
  })

  return (
    <Page
      description="See posts you've replied on Fameless"
      pageTitle="Replies"
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
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
        isLoading={isLoading}
        type="post"
      />
    </Page>
  )
}

export default UserRepliesPage
