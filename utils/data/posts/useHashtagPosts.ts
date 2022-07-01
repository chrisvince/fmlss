import { useAuthUser } from 'next-firebase-auth'
import { useEffect, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { KeyedMutator, useSWRConfig } from 'swr'

import { FirebaseDoc, Post } from '../../../types'
import {
  createHashtagPostsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getHashtagPosts from './getHashtagPosts'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'
import { FeedSortMode } from '../../../types/FeedSortMode'

const { PAGINATION_COUNT } = constants

type UsePostFeed = (
  hashtag: string,
  options?: {
    showType?: 'post' | 'reply' | 'both'
    sortMode?: FeedSortMode
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
  { showType = 'post', sortMode = 'latest' } = {}
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
  const lastPageLength = data?.at?.(-1)?.length
  const isLoading = !error && !data

  const moreToLoad = !isValidating && (
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT
  )

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
