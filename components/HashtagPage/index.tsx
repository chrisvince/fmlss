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
import useDelayedOnMount from '../../utils/useDelayedOnMount'
import useUserData from '../../utils/data/user/useUserData'
import {
  ResourceType,
  resourceViewed,
} from '../../utils/callableFirebaseFunctions/resourceViewed'
import SidebarPeopleSection from '../SidebarPeopleSection'
import { CellMeasurerCache } from 'react-virtualized'
import { PostTypeQuery } from '../../types/PostTypeQuery'
import InlineCreatePost from '../InlineCreatePost'

const {
  CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
  ENABLE_SHOW_REPLIES,
  ENABLE_SORTING,
  TOPICS_ENABLED,
} = constants

type PropTypes = {
  slug: string
}

const generateSortOptions = (slug: string) => [
  {
    href: `/hashtag/${slug}`,
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: `/hashtag/${slug}?sort=${HashtagSortMode.Latest}`,
    label: 'Latest',
    sortMode: 'latest',
  },
]

const cellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT,
})

const HashtagPage = ({ slug }: PropTypes) => {
  const {
    query: { sort },
  } = useRouter()

  const [showType, setShowType] = useState<PostTypeQuery>(PostTypeQuery.Post)

  const { track } = useTracking()
  const { user } = useUserData()

  const lowercaseSortMode =
    sort && typeof sort === 'string' ? sort.toLowerCase() : undefined

  const sortMode =
    lowercaseSortMode &&
    // @ts-expect-error: includes should be string
    Object.values(HashtagSortMode).includes(lowercaseSortMode)
      ? (lowercaseSortMode as HashtagSortMode)
      : HashtagSortMode.Popular

  const handlePostsLoadSuccess = () => {
    cellMeasurerCache.clearAll()
  }

  const { isLoading, likePost, loadMore, moreToLoad, posts, watchPost } =
    useHashtagPosts(slug, {
      showType,
      sortMode,
      swrConfig: { onSuccess: handlePostsLoadSuccess },
    })

  const handleIncludeRepliesChange = (event: SyntheticEvent) => {
    const { checked } = event.target as HTMLInputElement
    setShowType(checked ? PostTypeQuery.Both : PostTypeQuery.Post)
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

  useDelayedOnMount(() => {
    if (!user) return
    track('post', { slug }, { onceOnly: true })
    resourceViewed({ resourceType: ResourceType.Hashtag, slug })
  })

  return (
    <Page
      description={`See posts with the ${title} hashtag`}
      pageTitle={title}
      renderPageTitle
      rightPanelChildren={
        <>
          <SidebarPeopleSection />
          {TOPICS_ENABLED && <SidebarTopicsSection />}
          <SidebarHashtagsSection />
        </>
      }
    >
      {(ENABLE_SORTING || ENABLE_SHOW_REPLIES) && (
        <MobileContainer>
          {ENABLE_SORTING && (
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
                  variant={
                    sortModeOption === sortMode ? 'contained' : undefined
                  }
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          )}
          {ENABLE_SHOW_REPLIES && (
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
          )}
        </MobileContainer>
      )}
      <InlineCreatePost
        showBottomBorderOnFocus
        placeholder={`Use ${title} in your next post!`}
      />
      <Feed
        cellMeasurerCache={cellMeasurerCache}
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
