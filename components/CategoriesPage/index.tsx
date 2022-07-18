import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@mui/material'

import Page from '../Page'
import ViewSelectorButtonGroup from '../ViewSelectorButtonGroup'
import type { CategoriesSortMode } from '../../types'
import CategoriesList from '../CategoriesList'
import useCategories from '../../utils/data/categories/useCategories'
import MiniHashtagsSection from '../MiniHashtagsSection'

const SORT_MODE_OPTIONS = [
  {
    href: '/categories',
    label: 'Popular',
    sortMode: 'popular',
  },
  {
    href: '/categories/latest',
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

const CategoriesPage = () => {
  const { asPath: path } = useRouter()

  const pathSortMode = SORT_MODE_MAP[
    path?.split?.('/')?.[2] ?? 'popular'
  ] as CategoriesSortMode

  const [sortMode, setSortMode] = useState<CategoriesSortMode>(pathSortMode)
  const { cacheKey, categories, isLoading, loadMore, moreToLoad } =
    useCategories({
      sortMode,
    })
  console.log('categories', categories)
  

  useEffect(() => {
    setSortMode(pathSortMode)
  }, [pathSortMode])

  return (
    <Page
      pageTitle="Categories"
      rightPanelChildren={<MiniHashtagsSection />}
    >
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
      <CategoriesList
        cacheKey={cacheKey}
        categories={categories}
        isLoading={isLoading}
        moreToLoad={moreToLoad}
        onLoadMore={loadMore}
      />
    </Page>
  )
}

export default CategoriesPage
