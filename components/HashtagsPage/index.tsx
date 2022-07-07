import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'

import Page from '../Page'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import type { HashtagsSortMode } from '../../types'
import useHashtags from '../../utils/data/hashtags/useHashtags'

const SORT_MODE_OPTIONS = [
  {
    href: '/hashtags',
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: '/hashtags/latest',
    label: 'Latest',
    sortMode: 'latest',
  },
]

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
}

const HashtagsPage = () => {
  const { asPath: path } = useRouter()

  const pathSortMode = SORT_MODE_MAP[
    path?.split?.('/')?.[2] ?? 'popular'
  ] as HashtagsSortMode

  const [sortMode, setSortMode] = useState<HashtagsSortMode>(pathSortMode)
  const { isLoading, loadMore, moreToLoad, hashtags } = useHashtags({
    sortMode,
  })

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  return (
    <Page pageTitle="Hashtags">
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
      {hashtags.map(hashtag => (
        <div key={hashtag.data.id}>
          <Link href={`/hashtag/${hashtag.data.hashtag}`}>
            <a>{hashtag.data.hashtag}</a>
          </Link>
        </div>
      ))}
    </Page>
  )
}

export default HashtagsPage
