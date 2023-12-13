import { useRouter } from 'next/router'
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

const FeedPage = () => {
  const {
    query: { sortMode: sortModes },
  } = useRouter()

  const sortMode =
    FeedSortMode[
      (sortModes?.[0] ? sortModes[0] : FeedSortMode.latest) as FeedSortMode
    ]

  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    usePostFeed({ sortMode })

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
          <SidebarHashtagsSection />
          {TOPICS_ENABLED && <SidebarTopicsSection />}
        </>
      }
    >
      <FakeInlineCreatePost />
      <Feed
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        onWatchPost={watchPost}
        posts={posts}
      />
    </Page>
  )
}

export default FeedPage
