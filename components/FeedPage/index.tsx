import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Page from '../Page'
import Feed from '../Feed'
import usePostFeed from '../../utils/data/posts/usePostFeed'
import type { FeedSortMode } from '../../types'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import SidebarCategoriesSection from '../SidebarCategoriesSection'
import constants from '../../constants'
import InlineCreatePost from '../InlineCreatePost'

const { CATEGORIES_ENABLED } = constants

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
  'most-likes': 'mostLikes',
}

const FeedPage = () => {
  const { asPath: path } = useRouter()

  const pathSortMode = SORT_MODE_MAP[
    path?.split?.('/')?.[2] ?? 'latest'
  ] as FeedSortMode

  const [sortMode, setSortMode] = useState<FeedSortMode>(pathSortMode)

  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    usePostFeed({
      sortMode,
    })

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  return (
    <Page
      pageTitle="Feed"
      rightPanelChildren={
        <>
          <SidebarHashtagsSection />
          {CATEGORIES_ENABLED && <SidebarCategoriesSection />}
        </>
      }
    >
      <InlineCreatePost variant="feed" />
      <Feed
        isLoading={isLoading}
        key={sortMode}
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
