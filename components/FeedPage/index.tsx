import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'

import Page from '../Page'
import Feed from '../Feed'
import usePostFeed from '../../utils/data/posts/usePostFeed'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import type { FeedSortMode } from '../../types'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MobileContainer from '../MobileContainer'

const SORT_MODE_OPTIONS = [
  {
    href: '/feed',
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: '/feed/popular',
    label: 'Popular',
    sortMode: 'popular',
  },
  // {
  //   href: '/feed/most-likes',
  //   label: 'Most Likes',
  //   sortMode: 'mostLikes',
  // }
]

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
  'most-likes': 'mostLikes',
}

const FeedPage = () => {
  const { asPath: path } = useRouter()

  const pathSortMode =
    SORT_MODE_MAP[path?.split?.('/')?.[2] ?? 'latest'] as FeedSortMode

  const [sortMode, setSortMode] = useState<FeedSortMode>(pathSortMode)
  const { cacheKey, isLoading, loadMore, moreToLoad, posts, likePost } =
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
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      <MobileContainer>
        <ViewSelectorButtonGroup>
          {SORT_MODE_OPTIONS.map(
            ({ href, sortMode: sortModeOption, label }) => (
              <Link href={href} key={href} passHref shallow>
                <Button
                  variant={
                    sortModeOption === sortMode ? 'contained' : undefined
                  }
                >
                  {label}
                </Button>
              </Link>
            )
          )}
        </ViewSelectorButtonGroup>
      </MobileContainer>
      <Feed
        cacheKey={cacheKey}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default FeedPage
