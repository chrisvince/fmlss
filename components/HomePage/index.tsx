import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'

import Page from '../Page'
import Feed from '../Feed'
import usePostFeed from '../../utils/data/posts/usePostFeed'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import type { FeedSortMode } from '../../types/FeedSortMode'

const SORT_MODE_OPTIONS = [
  {
    href: '/home',
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: '/home/popular',
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: '/home/most-likes',
    label: 'Most Likes',
    sortMode: 'mostLikes',
  }
]

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
  'most-likes': 'mostLikes',
}

const HomePage = () => {
  const { asPath: path } = useRouter()

  const pathSortMode =
    SORT_MODE_MAP[path?.split?.('/')?.[2] ?? 'latest'] as FeedSortMode

  const [sortMode, setSortMode] = useState<FeedSortMode>(pathSortMode)
  const { moreToLoad, loadMore, posts } = usePostFeed({ sortMode })

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  return (
    <Page pageTitle="Home">
      <h1>Home</h1>
      <ViewSelectorButtonGroup>
        {SORT_MODE_OPTIONS.map(({ href, sortMode: sortModeOption, label }) => (
          <Link href={href} key={href} passHref shallow>
            <Button
              variant={sortModeOption === sortMode ? 'contained' : undefined}
            >
              {label}
            </Button>
          </Link>
        ))}
      </ViewSelectorButtonGroup>
      <Feed moreToLoad={moreToLoad} onLoadMore={loadMore} posts={posts} />
    </Page>
  )
}

export default HomePage
