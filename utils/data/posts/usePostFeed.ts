import { useAuthUser } from 'next-firebase-auth'
import { useEffect, useState } from 'react'
import { KeyedMutator, useSWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'

import { FirebaseDoc, Post } from '../../../types'
import {
  createPostFeedCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import getPostFeed from './getPostFeed'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

type UsePostFeed = () => {
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Post[]>
  mutate: KeyedMutator<Post[]>
  posts: Post[]
  moreToLoad: boolean
}

const usePostFeed: UsePostFeed = () => {
  const [pageStartAfterTrace, setPageStartAfterTrace] =
    useState<{[key: string]: FirebaseDoc}>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createPostFeedCacheKey()]
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
      return createPostFeedCacheKey(index)
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getPostFeed({ uid, startAfter: pageStartAfterTrace[pageIndex] })
    },
    {
      fallbackData,
      revalidateOnMount: true,
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
  
  const posts = data?.flat() ?? []
  const lastPageLength = data?.at(-1)?.length
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

export default usePostFeed
