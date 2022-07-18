import { SyntheticEvent, useState } from 'react'
import Link from 'next/link'
import { Button, FormControlLabel, Switch } from '@mui/material'
import { useRouter } from 'next/router'
import { Box } from '@mui/system'

import Page from '../Page'
import Feed from '../Feed'
import useHashtagPosts from '../../utils/data/posts/useHashtagPosts'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import { HashtagSortMode } from '../../types'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'

type PropTypes = {
  hashtag: string
}

const generateSortOptions = (hashtag: string) => [
  {
    href: `/hashtag/${hashtag}`,
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: `/hashtag/${hashtag}?sort=popular`,
    label: 'Popular',
    sortMode: 'popular',
  },
  // {
  //   href: `/hashtag/${hashtag}?sort=most-likes`,
  //   label: 'Most Likes',
  //   sortMode: 'mostLikes',
  // },
]

const SORT_MODE_MAP: {
  [key: string]: string
} = {
  latest: 'latest',
  popular: 'popular',
  'most-likes': 'mostLikes',
}

const HashtagPage = ({ hashtag }: PropTypes) => {
  const { query: { sort } } = useRouter()
  const [showType, setShowType] = useState<'post' | 'both'>('post')

  const sortMode =
    (SORT_MODE_MAP[sort as string] ?? 'latest') as HashtagSortMode

  const { cacheKey, isLoading, loadMore, moreToLoad, posts } = useHashtagPosts(
    hashtag,
    {
      showType: showType,
      sortMode,
    }
  )

  const handleIncludeRepliesChange = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement
    setShowType(checked ? 'both' : 'post')
  }

  const sortOptions = generateSortOptions(hashtag)
  const title = `#${hashtag}`

  return (
    <Page
      pageTitle={title}
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          <MiniCategoriesSection />
        </>
      }
    >
      <ViewSelectorButtonGroup>
        {sortOptions.map(({ href, sortMode: sortModeOption, label }) => (
          <Link href={href} key={href} passHref shallow>
            <Button
              variant={sortModeOption === sortMode ? 'contained' : undefined}
            >
              {label}
            </Button>
          </Link>
        ))}
      </ViewSelectorButtonGroup>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingY: 2,
        }}
      >
        <FormControlLabel
          control={<Switch onChange={handleIncludeRepliesChange} />}
          label="Include replies"
          labelPlacement="start"
        />
      </Box>
      <Feed
        cacheKey={cacheKey}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default HashtagPage
