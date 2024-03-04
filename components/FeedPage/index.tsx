import Page from '../Page'
import Feed from '../Feed'
import usePostFeed from '../../utils/data/posts/usePostFeed'
import { FeedSortMode } from '../../types'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarTopicsSection from '../SidebarTopicsSection'
import constants from '../../constants'
import FakeInlineCreatePost from '../FakeInlineCreatePost'
import Error from 'next/error'

const { TOPICS_ENABLED } = constants

enum TITLE_MAP {
  latest = 'Feed',
  popular = 'Popular',
}

interface Props {
  sortMode: FeedSortMode
}

const FeedPage = ({ sortMode }: Props) => {
  const {
    isLoading,
    likePost,
    loadMore,
    moreToLoad,
    posts,
    reactToPost,
    watchPost,
  } = usePostFeed({ sortMode })

  if (!sortMode) {
    return <Error statusCode={404} />
  }

  const pageTitle = TITLE_MAP[sortMode]

  return (
    <Page
      pageTitle={pageTitle}
      renderPageTitle
      rightPanelChildren={
        <>
          {TOPICS_ENABLED && <SidebarTopicsSection />}
          <SidebarHashtagsSection />
        </>
      }
    >
      <FakeInlineCreatePost />
      <Feed
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        onPostReaction={reactToPost}
        onWatchPost={watchPost}
        posts={posts}
      />
    </Page>
  )
}

export default FeedPage
