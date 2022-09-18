import Link from 'next/link'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { CellMeasurerCache } from 'react-virtualized'

import Page from '../Page'
import Feed from '../Feed'
import useCategoryPosts from '../../utils/data/posts/useCategoryPosts'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import { CategorySortMode } from '../../types'
import MobileContainer from '../MobileContainer'
import MiniHashtagsSection from '../MiniHashtagsSection'
import unslugify from '../../utils/unslugify'
import constants from '../../constants'
import PageSpinner from '../PageSpinner'
import useTracking from '../../utils/tracking/useTracking'
import { useEffect } from 'react'

const { CELL_CACHE_MEASURER_POST_ITEM_MIN_HEIGHT } = constants

type PropTypes = {
  slug: string
}

const generateSortOptions = (slug: string) => [
  {
    href: `/category/${slug}`,
    label: 'Latest',
    sortMode: 'latest',
  },
  {
    href: `/category/${slug}?sort=popular`,
    label: 'Popular',
    sortMode: 'popular',
  },
  // {
  //   href: `/category/${slug}?sort=most-likes`,
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

const CategoryPage = ({ slug }: PropTypes) => {
  const { query: { sort } } = useRouter()
  const { track } = useTracking()

  const sortMode =
    (SORT_MODE_MAP[sort as string] ?? 'latest') as CategorySortMode

  const { isLoading, loadMore, moreToLoad, posts, likePost } =
    useCategoryPosts(slug, {
      sortMode,
      swrConfig: {
        onSuccess: () => cellMeasurerCache.clearAll()
      },
    })

  const categoryName = unslugify(slug)
  const sortOptions = generateSortOptions(slug)

  useEffect(() => {
    if (isLoading) return
    track('category', {
      category: categoryName,
      slug,
    }, { onceOnly: true })
  }, [categoryName, isLoading, slug, track])

  return (
    <Page
      description={`See posts in the ${categoryName} category`}
      pageTitle={categoryName}
      rightPanelChildren={<MiniHashtagsSection />}
    >
      <MobileContainer>
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
      </MobileContainer>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Feed
          cellMeasurerCache={cellMeasurerCache}
          moreToLoad={moreToLoad}
          onLikePost={likePost}
          onLoadMore={loadMore}
          posts={posts}
        />
      )}
    </Page>
  )
}

export default CategoryPage
