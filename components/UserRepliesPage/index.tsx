import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import useUserPosts from '../../utils/data/userPosts/useUserPosts'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
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
      pageTitle="Replies"
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

export default UserRepliesPage
