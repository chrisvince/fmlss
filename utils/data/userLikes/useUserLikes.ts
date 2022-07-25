import { useAuthUser } from 'next-firebase-auth'
import { useCallback, useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { useSWRConfig } from 'swr'

import { FirebaseDoc, Post } from '../../../types'
import {
  createUserLikesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getUserLikes from './getUserLikes'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'
import checkUserLikesPost from '../utils/data-infinite-loading/checkUserLikesPost'
import updatePostLikeInServer from '../utils/data-infinite-loading/updatePostLikeInServer'
import mutatePostLikeInData from '../utils/data-infinite-loading/mutatePostLikeInData'
import { InfiniteData } from '../types'

const { PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UseUserLikes = (options?: { swrConfig?: SWRInfiniteConfiguration }) => {
  cacheKey: string
  error: any
  isLoading: boolean
  isValidating: boolean
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  posts: Post[]
}

const useUserLikes: UseUserLikes = ({ swrConfig = {} } = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] =
    useState<{[key: string]: FirebaseDoc}>({})

  const { id: uid } = useAuthUser()
  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createUserLikesCacheKey(uid!)]

  if (!uid) {
    console.error('uid must be set.')
  }

  const {
    data,
    error,
    isValidating,
    mutate,
    size,
    setSize,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && previousPageData.length < PAGINATION_COUNT) {
        return null
      }
      return createUserLikesCacheKey(uid!, index)
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getUserLikes(uid!, {
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

  const likePost = useCallback(async (slug: string) => {
    const userLikesPost = checkUserLikesPost(slug, data)
    await updatePostLikeInServer(userLikesPost, slug)
    await mutate()
  }, [data, mutate])

  const posts = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length
  const isLoading = !error && !data

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT

  const cacheKey = createUserLikesCacheKey(uid!, null)

  return {
    cacheKey,
    error,
    isLoading,
    isValidating,
    likePost,
    loadMore,
    moreToLoad,
    posts,
  }
}

export default useUserLikes
