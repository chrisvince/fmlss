import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { CategoriesSortMode, Category, FirebaseDoc } from '../../../types'
import {
  createCategoriesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import getCategories from './getCategories'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UseCategories = (options?: {
  sortMode?: CategoriesSortMode
  swrConfig?: SWRInfiniteConfiguration
}) => {
  categories: Category[]
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Category[]>
  moreToLoad: boolean
}

const useCategories: UseCategories = ({
  sortMode = 'latest',
  swrConfig = {},
} = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createCategoriesCacheKey(sortMode)]

  const { data, error, isLoading, isValidating, setSize, size } =
    useSWRInfinite(
      (index, previousPageData) => {
        if (previousPageData && previousPageData.length < PAGINATION_COUNT) {
          return null
        }
        return createCategoriesCacheKey(sortMode, index)
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        return getCategories({
          sortMode,
          startAfter: pageStartAfterTrace[pageIndex],
        })
      },
      {
        fallbackData,
        ...DEFAULT_SWR_CONFIG,
        ...swrConfig,
      }
    )

  const lastPageLastDoc = getLastDocOfLastPage(data)
  useEffect(() => {
    if (!lastPageLastDoc) return
    setPageStartAfterTrace(currentState => ({
      ...currentState,
      [size]: lastPageLastDoc,
    }))
  }, [lastPageLastDoc, size])

  const loadMore = async () => {
    const data = await setSize(size + 1)
    return data?.flat() ?? []
  }

  const categories = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT

  return {
    categories,
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
  }
}

export default useCategories
