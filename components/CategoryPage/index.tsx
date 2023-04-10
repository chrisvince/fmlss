import Link from 'next/link'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

import Page from '../Page'
import Feed from '../Feed'
import useCategoryPosts from '../../utils/data/posts/useCategoryPosts'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import { CategorySortMode } from '../../types'
import MobileContainer from '../MobileContainer'
import MiniHashtagsSection from '../MiniHashtagsSection'
import unslugify from '../../utils/unslugify'
import useTracking from '../../utils/tracking/useTracking'
import { useEffect, useState } from 'react'

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

const CategoryPage = ({ slug }: PropTypes) => {
  const {
    query: { sort },
  } = useRouter()
  const { track } = useTracking()

  const pathSortMode = (SORT_MODE_MAP[sort as string] ??
    'latest') as CategorySortMode

  const [sortMode, setSortMode] = useState<CategorySortMode>(pathSortMode)

  const { isLoading, loadMore, moreToLoad, posts, likePost } = useCategoryPosts(
    slug,
    { sortMode }
  )

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  const categoryName = unslugify(slug)
  const sortOptions = generateSortOptions(slug)

  useEffect(() => {
    if (isLoading) return
    track(
      'category',
      {
        category: categoryName,
        slug,
      },
      { onceOnly: true }
    )
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
      </MobileContainer>
      <Feed
        isLoading={isLoading}
        key={sortMode}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
        type="post"
      />
    </Page>
  )
}

export default CategoryPage
