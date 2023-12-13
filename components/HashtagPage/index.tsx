import { SyntheticEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button, ButtonGroup, FormControlLabel, Switch } from '@mui/material'
import { useRouter } from 'next/router'
import { Box } from '@mui/system'

import Page from '../Page'
import Feed from '../Feed'
import useHashtagPosts from '../../utils/data/posts/useHashtagPosts'
import { HashtagSortMode } from '../../types'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import MobileContainer from '../MobileContainer'
import constants from '../../constants'
import useTracking from '../../utils/tracking/useTracking'
import { HashtagShowType } from '../../utils/data/posts/getHashtagPosts'

const { TOPICS_ENABLED } = constants

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
]

const HashtagPage = ({ slug }: PropTypes) => {
  const {
    query: { sort },
  } = useRouter()
  const [showType, setShowType] = useState<HashtagShowType>(
    HashtagShowType.Post
  )

  const { track } = useTracking()

  const lowercaseSortMode =
    sort && typeof sort === 'string' ? sort.toLowerCase() : undefined

  const sortMode =
    lowercaseSortMode &&
    // @ts-expect-error: includes should be string
    Object.values(HashtagSortMode).includes(lowercaseSortMode)
      ? (lowercaseSortMode as HashtagSortMode)
      : HashtagSortMode.Latest

  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    useHashtagPosts(slug, {
      showType: showType,
      sortMode,
    })

  const handleIncludeRepliesChange = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement
    setShowType(checked ? HashtagShowType.Both : HashtagShowType.Post)
  }

  const sortOptions = generateSortOptions(slug)
  const title = `#${slug}`

  useEffect(() => {
    if (isLoading) return
    track(
      'hashtag',
      {
        slug,
        title,
      },
      { onceOnly: true }
    )
  }, [isLoading, slug, title, track])

  return (
    <Page
      description={`See posts with the ${title} hashtag`}
      pageTitle={title}
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarHashtagsSection />
          {TOPICS_ENABLED && <SidebarTopicsSection />}
        </>
      }
    >
      <MobileContainer>
        <ButtonGroup
          aria-label="Sort Selection"
          fullWidth
          size="small"
          sx={{ marginBottom: 2 }}
          variant="outlined"
        >
          {sortOptions.map(({ href, sortMode: sortModeOption, label }) => (
            <Button
              component={Link}
              href={href}
              key={href}
              replace
              shallow
              variant={sortModeOption === sortMode ? 'contained' : undefined}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
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

export default HashtagPage
