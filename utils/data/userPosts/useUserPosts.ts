import { useAuthUser } from 'next-firebase-auth'
import { useCallback, useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { useSWRConfig } from 'swr'

import { FirebaseDoc, Post } from '../../../types'
import {
  createUserPostsCacheKey,
  createUserRepliesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getUserPosts from './getUserPosts'
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

type UseUserPosts = (options?: {
  type?: 'post' | 'reply'
  swrConfig?: SWRInfiniteConfiguration
}) => {
  cacheKey: string
  error: any
  isLoading: boolean
  isValidating: boolean
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
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
    mutate,
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

  const likePost = useCallback(async (slug: string) => {
    const handleMutation = async (currentData: any) => {
      const userLikesPost = checkUserLikesPost(slug, currentData)

      await updatePostLikeInServer(userLikesPost, slug)

      const mutatedData = mutatePostLikeInData(
        userLikesPost,
        slug,
        currentData as InfiniteData
      )

      return mutatedData
    }

    await mutate(handleMutation, false)
  }, [mutate])

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
    likePost,
    loadMore,
    moreToLoad,
    posts,
  }
}

export default useUserPosts
