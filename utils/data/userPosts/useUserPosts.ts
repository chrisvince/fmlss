import { useAuthUser } from 'next-firebase-auth'
import { useCallback, useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { MutatorCallback, useSWRConfig } from 'swr'

import { FirebaseDoc, Post } from '../../../types'
import {
  createUserPostsCacheKey,
  createUserRepliesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getUserPosts from './getUserPosts'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'
import checkUserLikesPost from '../utils/checkUserLikesPost'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import { mutatePostLikeInfiniteData } from '../utils/mutatePostLike'
import { InfiniteData } from '../types'
import { mutateWatchingPostInfiniteData } from '../utils/mutateWatchingPost'
import updateWatchingPostInServer from '../utils/updateWatchingPostInServer'
import checkUserWatchingPost from '../utils/checkUserWatchingPost'

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
  error: unknown
  isLoading: boolean
  isValidating: boolean
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  posts: Post[]
  watchPost: (documentPath: string) => Promise<void>
}

const useUserPosts: UseUserPosts = ({ type = 'post', swrConfig = {} } = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { id: uid } = useAuthUser()
  const { fallback } = useSWRConfig()

  const createCacheKey = {
    post: createUserPostsCacheKey,
    reply: createUserRepliesCacheKey,
  }[type]
  const fallbackData = uid ? fallback[createCacheKey(uid)] : null

  if (!uid) {
    console.error('uid must be set.')
  }

  const { data, error, isLoading, isValidating, mutate, setSize, size } =
    useSWRInfinite(
      (index, previousPageData) => {
        if (
          !uid ||
          (previousPageData && previousPageData.length < PAGINATION_COUNT)
        ) {
          return null
        }
        return createCacheKey(uid, { pageIndex: index })
      },
      key => {
        if (!uid) {
          return null
        }

        const pageIndex = getPageIndexFromCacheKey(key)
        return getUserPosts(uid, {
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

  const likePost = useCallback(
    async (slug: string) => {
      const handleMutation: MutatorCallback<
        InfiniteData
      > = async currentData => {
        if (!currentData) return
        const userLikesPost = checkUserLikesPost(slug, currentData)
        await updatePostLikeInServer(userLikesPost, slug)

        const mutatedData = mutatePostLikeInfiniteData(
          userLikesPost,
          slug,
          currentData
        )

        return mutatedData
      }

      await mutate(handleMutation, false)
    },
    [mutate]
  )

  const watchPost = useCallback(
    async (slug: string) => {
      const handleMutation: MutatorCallback<
        InfiniteData
      > = async currentData => {
        if (!currentData) return

        const userIsWatchingPost = checkUserWatchingPost(slug, currentData)
        await updateWatchingPostInServer(userIsWatchingPost, slug)

        const mutatedData = mutateWatchingPostInfiniteData(
          userIsWatchingPost,
          slug,
          currentData
        )

        return mutatedData
      }

      await mutate(handleMutation, false)
    },
    [mutate]
  )

  const posts = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT

  return {
    error,
    isLoading,
    isValidating,
    likePost,
    loadMore,
    moreToLoad,
    posts,
    watchPost,
  }
}

export default useUserPosts
