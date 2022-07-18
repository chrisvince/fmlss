import { useAuthUser } from 'next-firebase-auth'
import { useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { KeyedMutator, useSWRConfig } from 'swr'

import { FirebaseDoc, Post } from '../../../types'
import {
  createUserPostsCacheKey,
  createUserRepliesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getUserPosts from './getUserPosts'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateAll: false,
}

type UseUserPosts = (options?: {
  type?: 'post' | 'reply'
  swrConfig?: SWRInfiniteConfiguration
}) => {
  cacheKey: string
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  mutate: KeyedMutator<Post[]>
  posts: Post[]
}

const useUserPosts: UseUserPosts = ({ type = 'post', swrConfig = {} } ={}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] =
    useState<{[key: string]: FirebaseDoc}>({})

  const { id: uid } = useAuthUser()
  const { fallback } = useSWRConfig()

  const createCacheKey = {
    post: createUserPostsCacheKey,
    reply: createUserRepliesCacheKey,
  }[type]
  const fallbackData = fallback[createCacheKey(uid!)]

  if (!uid) {
    console.error('uid must be set.')
  }

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
      return createCacheKey(uid!, index)
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getUserPosts(uid!, {
        startAfter: pageStartAfterTrace[pageIndex],
        type,
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

  const mutate = async () => {
    const data = await mutateOriginal()
    return data?.flat() ?? []
  }

  const posts = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length
  const isLoading = !error && !data

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT
  
  const cacheKey = createCacheKey(uid!, null)

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

export default useUserPosts
