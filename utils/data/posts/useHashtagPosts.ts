import { useCallback, useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { MutatorCallback, useSWRConfig } from 'swr'

import { HashtagSortMode, FirebaseDoc, Post } from '../../../types'
import {
  createHashtagPostsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getHashtagPosts, { HashtagShowType } from './getHashtagPosts'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'
import { InfiniteData } from '../types'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import checkUserLikesPost from '../utils/checkUserLikesPost'
import { mutatePostLikeInfiniteData } from '../utils/mutatePostLike'
import { mutateWatchedPostInfiniteData } from '../utils/mutateWatchedPost'
import updateWatchedPostInServer from '../utils/updateWatchedPostInServer'
import checkUserWatchingPost from '../utils/checkUserWatchingPost'
import useAuth from '../../auth/useAuth'

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UsePostFeed = (
  slug: string,
  options?: {
    showType?: HashtagShowType
    sortMode?: HashtagSortMode
    swrConfig?: SWRInfiniteConfiguration
  }
) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  posts: Post[]
  watchPost: (documentPath: string) => Promise<void>
}

const useHashtagPosts: UsePostFeed = (
  slug,
  {
    showType = HashtagShowType.Post,
    sortMode = HashtagSortMode.Latest,
    swrConfig = {},
  } = {}
) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const { uid } = useAuth() ?? {}

  const fallbackData =
    fallback[createHashtagPostsCacheKey(slug, showType, sortMode)]

  const { data, error, isLoading, isValidating, mutate, setSize, size } =
    useSWRInfinite(
      (index, previousPageData) => {
        if (
          !uid ||
          (previousPageData && previousPageData.length < POST_PAGINATION_COUNT)
        ) {
          return null
        }
        return createHashtagPostsCacheKey(slug, showType, sortMode, index)
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        if (!uid) return []

        return getHashtagPosts(slug, {
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
        await updateWatchedPostInServer(userIsWatchingPost, slug)

        const mutatedData = mutateWatchedPostInfiniteData(
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
  const lastPageLength = data?.at?.(-1)?.length ?? 0

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= POST_PAGINATION_COUNT

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

export default useHashtagPosts
