import { useAuthUser } from 'next-firebase-auth'
import { useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { KeyedMutator, useSWRConfig } from 'swr'

import { CategorySortMode, FirebaseDoc, Post } from '../../../types'
import {
  createCategoryPostsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getCategoryPosts from './getCategoryPosts'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UseCategoryPosts = (
  slug: string,
  options?: {
    sortMode?: CategorySortMode
    swrConfig?: SWRInfiniteConfiguration
  },
) => {
  cacheKey: string
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  mutate: KeyedMutator<Post[]>
  posts: Post[]
}

const useCategoryPosts: UseCategoryPosts = (
  slug,
  {
    sortMode = 'latest',
    swrConfig = {},
  } = {},
) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createCategoryPostsCacheKey(slug, sortMode)]
  const { id: uid } = useAuthUser()

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
      return createCategoryPostsCacheKey(slug, sortMode, index)
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getCategoryPosts(slug, {
        sortMode,
        startAfter: pageStartAfterTrace[pageIndex],
        uid,
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
    setPageStartAfterTrace((currentState) => ({
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

  const posts = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length ?? 0
  const isLoading = !error && !data

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT

  const cacheKey = createCategoryPostsCacheKey(slug, sortMode, null)

  return {
    cacheKey,
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
    mutate,
    posts,
  }
}

export default useCategoryPosts
