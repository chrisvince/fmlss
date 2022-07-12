import { useEffect, useState } from 'react'
import { KeyedMutator, useSWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'

import { CategoriesSortMode, Category, FirebaseDoc } from '../../../types'
import {
  createCategoriesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import getCategories from './getCategories'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

type UseCategories = (options?: { sortMode?: CategoriesSortMode }) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Category[]>
  mutate: KeyedMutator<Category[]>
  categories: Category[]
  moreToLoad: boolean
}

const useCategories: UseCategories = ({ sortMode = 'latest' } = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createCategoriesCacheKey(sortMode)]

  const {
    data,
    error,
    isValidating,
    mutate: mutateOriginal,
    size,
    setSize,
  } = useSWRInfinite(
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
      revalidateOnMount: true,
      revalidateOnFocus: false,
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

  const mutate = async () => {
    const data = await mutateOriginal()
    return data?.flat() ?? []
  }

  const categories = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length
  const isLoading = !error && !data
  const moreToLoad = !isValidating && (
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT
  )

  return {
    categories,
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
    mutate,
  }
}

export default useCategories
