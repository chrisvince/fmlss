import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'
import constants from '../../constants'
import PageSpinner from '../PageSpinner'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } = constants

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

const UserRepliesPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts } =
    useUserPosts({
      type: 'reply',
      swrConfig: {
        onSuccess: () => cellMeasurerCache.clearAll(),
      },
    })

  return (
    <Page
      description="See posts you've replied on Fameless"
      pageTitle="Replies"
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Feed
          cellMeasurerCache={cellMeasurerCache}
          moreToLoad={moreToLoad}
          onLikePost={likePost}
          onLoadMore={loadMore}
          posts={posts}
        />
      )}
    </Page>
  )
}

export default UserRepliesPage
