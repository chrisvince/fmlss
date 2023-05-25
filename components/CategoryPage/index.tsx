import Link from 'next/link'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

import Page from '../Page'
import Feed from '../Feed'
import useCategoryPosts from '../../utils/data/posts/useCategoryPosts'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import { CategorySortMode } from '../../types'
import MobileContainer from '../MobileContainer'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import useTracking from '../../utils/tracking/useTracking'
import { useEffect, useState } from 'react'
import useCategory from '../../utils/data/category/useCategory'
import Error from 'next/error'

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
  const { category, isLoading: categoryIsLoading } = useCategory(slug)
  const { track } = useTracking()

  const pathSortMode = (SORT_MODE_MAP[sort as string] ??
    'latest') as CategorySortMode

  const [sortMode, setSortMode] = useState<CategorySortMode>(pathSortMode)

  const {
    isLoading: postsAreLoading,
    likePost,
    loadMore,
    moreToLoad,
    posts,
  } = useCategoryPosts(slug, { sortMode })

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  const sortOptions = generateSortOptions(slug)

  useEffect(() => {
    if (categoryIsLoading) return
    track(
      'category',
      {
        category: category?.data.name,
        slug,
      },
      { onceOnly: true }
    )
  }, [category?.data.name, categoryIsLoading, slug, track])

  if (
    (!categoryIsLoading && !category) ||
    (!postsAreLoading && posts.length === 0)
  ) {
    return <Error statusCode={404} />
  }

  return (
    <Page
      description={`See posts in the ${category?.data.name} category`}
      pageTitle={category?.data.name}
      rightPanelChildren={<SidebarHashtagsSection />}
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
        isLoading={categoryIsLoading || postsAreLoading}
        key={sortMode}
        moreToLoad={moreToLoad}
        onLikePost={likePost}
        onLoadMore={loadMore}
        posts={posts}
      />
    </Page>
  )
}

export default CategoryPage
