import { useAuthUser } from 'next-firebase-auth'
import { useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { KeyedMutator, useSWRConfig } from 'swr'

import { HashtagSortMode, FirebaseDoc, Post } from '../../../types'
import {
  createHashtagPostsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getHashtagPosts from './getHashtagPosts'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UsePostFeed = (
  hashtag: string,
  options?: {
    showType?: 'post' | 'reply' | 'both'
    sortMode?: HashtagSortMode
    swrConfig?: SWRInfiniteConfiguration
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

const useHashtagPosts: UsePostFeed = (
  hashtag,
  {
    showType = 'post',
    sortMode = 'latest',
    swrConfig = {},
  } = {},
) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()

  const fallbackData =
    fallback[createHashtagPostsCacheKey(hashtag, showType, sortMode)]

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
      return createHashtagPostsCacheKey(hashtag, showType, sortMode, index)
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getHashtagPosts(hashtag, {
        sortMode,
        startAfter: pageStartAfterTrace[pageIndex],
        showType,
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

export default useHashtagPosts
