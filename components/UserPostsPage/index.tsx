import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'
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

const UserPostsPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts } = useUserPosts({
    type: 'post',
  })

  return (
    <Page
      description="See posts you've posted on Fameless"
      pageTitle="Posts"
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

export default UserPostsPage
