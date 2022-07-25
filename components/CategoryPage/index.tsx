import { SyntheticEvent } from 'react'
import Link from 'next/link'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

import Page from '../Page'
import Feed from '../Feed'
import useCategoryPosts from '../../utils/data/posts/useCategoryPosts'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import { CategorySortMode } from '../../types'
import useCategory from '../../utils/data/category/useCategory'
import MobileContainer from '../MobileContainer'

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
  const { query: { sort } } = useRouter()

  const sortMode =
    (SORT_MODE_MAP[sort as string] ?? 'latest') as CategorySortMode

  const { category } = useCategory(slug)

  const { cacheKey, isLoading, loadMore, moreToLoad, posts, likePost } =
    useCategoryPosts(slug, { sortMode })

  const sortOptions = generateSortOptions(slug)

  return (
    <Page pageTitle={category.data.name}>
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

export default CategoryPage
