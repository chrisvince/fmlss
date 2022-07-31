import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import useUserLikes from '../../utils/data/userLikes/useUserLikes'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
})

const UserLikesPage = () => {
  const { isLoading, likePost, loadMore, moreToLoad, posts } =
    useUserLikes({
      swrConfig: {
        onSuccess: () => cellMeasurerCache.clearAll(),
      },
    })

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
        cellMeasurerCache={cellMeasurerCache}
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
