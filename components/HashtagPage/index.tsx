import { SyntheticEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, FormControlLabel, Switch } from '@mui/material'
import { useRouter } from 'next/router'
import { Box } from '@mui/system'
import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import useHashtagPosts from '../../utils/data/posts/useHashtagPosts'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import { HashtagSortMode } from '../../types'
import MiniCategoriesSection from '../MiniCategoriesSection'
import MiniHashtagsSection from '../MiniHashtagsSection'
import MobileContainer from '../MobileContainer'
import constants from '../../constants'
import PageSpinner from '../PageSpinner'
import useTracking from '../../utils/tracking/useTracking'

const {
  CATEGORIES_ENABLED,
  CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
} = constants

type PropTypes = {
  slug: string
}

const generateSortOptions = (slug: string) => [
  {
    href: `/hashtag/${slug}`,
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: `/hashtag/${slug}?sort=popular`,
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

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

const HashtagPage = ({ slug }: PropTypes) => {
  const { query: { sort } } = useRouter()
  const [showType, setShowType] = useState<'post' | 'both'>('post')
  const { track } = useTracking()

  const pathSortMode =
    (SORT_MODE_MAP[sort as string] ?? 'latest') as HashtagSortMode
  
  const [sortMode, setSortMode] = useState<HashtagSortMode>(pathSortMode)

  const { isLoading, likePost, loadMore, moreToLoad, posts } = useHashtagPosts(
    slug,
    {
      showType: showType,
      sortMode,
    }
  )

  useEffect(() => {
    setSortMode(pathSortMode)
    cellMeasurerCache.clearAll()
  }, [pathSortMode])

  const handleIncludeRepliesChange = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement
    setShowType(checked ? 'both' : 'post')
  }

  const sortOptions = generateSortOptions(slug)
  const title = `#${slug}`

  useEffect(() => {
    if (isLoading) return
    track('hashtag', {
      slug,
      title,
    }, { onceOnly: true })
  }, [isLoading, slug, title, track])

  return (
    <Page
      description={`See posts with the ${title} hashtag`}
      pageTitle={title}
      renderPageTitle
      rightPanelChildren={
        <>
          <MiniHashtagsSection />
          {CATEGORIES_ENABLED && <MiniCategoriesSection />}
        </>
      }
    >
      <MobileContainer>
        <ViewSelectorButtonGroup>
          {sortOptions.map(({ href, sortMode: sortModeOption, label }) => (
            <Button
              component={Link}
              href={href}
              key={href}
              shallow
              variant={sortModeOption === sortMode ? 'contained' : undefined}
            >
              {label}
            </Button>
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
      </MobileContainer>
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

export default HashtagPage
