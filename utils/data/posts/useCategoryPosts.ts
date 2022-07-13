import { useAuthUser } from 'next-firebase-auth'
import { useEffect, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
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

type UseCategoryPosts = (
  slug: string,
  options?: {
    sortMode?: CategorySortMode
  }
) => {
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
  { sortMode = 'latest' } = {}
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
      revalidateOnMount: true,
      revalidateOnFocus: false,
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

  const moreToLoad = !isValidating && lastPageLength >= PAGINATION_COUNT

  return {
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
