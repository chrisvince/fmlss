import { useCallback, useEffect, useState } from 'react'
import { useAuthUser } from 'next-firebase-auth'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { MutatorCallback, useSWRConfig } from 'swr'
import { reverse } from 'ramda'

import { FirebaseDoc, Post } from '../../../types'
import {
  createPostRepliesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import usePost from '../post/usePost'
import getPostReplies from './getPostReplies'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'
import checkUserLikesPost from '../utils/checkUserLikesPost'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import { mutatePostLikeInfiniteData } from '../utils/mutatePostLike'
import { InfiniteData } from '../types'
import updateWatchedPostInServer from '../utils/updateWatchedPostInServer'
import { mutateWatchedPostInfiniteData } from '../utils/mutateWatchedPost'
import checkUserWatchingPost from '../utils/checkUserWatchingPost'

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UsePostReplies = (
  slug?: string,
  options?: {
    viewMode?: 'start' | 'end'
    swrConfig?: SWRInfiniteConfiguration
  }
) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  likePost: (documentPath: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  refresh: () => Promise<void>
  replies: Post[]
  watchPost: (slug: string) => Promise<void>
}

const usePostReplies: UsePostReplies = (
  slug,
  { viewMode = 'start', swrConfig = {} } = {}
) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = slug
    ? fallback[createPostRepliesCacheKey(slug, { pageIndex: 0, viewMode })]
    : undefined
  const { id: uid } = useAuthUser()
  const { post, isValidating: postIsValidating } = usePost(slug)

  const {
    data,
    error,
    isLoading,
    isValidating: repliesAreValidating,
    mutate,
    setSize,
    size,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (
        (previousPageData && previousPageData.length < POST_PAGINATION_COUNT) ||
        !post ||
        !slug
      ) {
        return null
      }
      return createPostRepliesCacheKey(slug, { pageIndex: index, viewMode })
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getPostReplies(post!.data.reference, slug!, {
        uid,
        startAfter: pageStartAfterTrace[pageIndex],
        viewMode,
      })
    },
    {
      fallbackData,
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  useEffect(() => {
    const lastPageLastDoc = getLastDocOfLastPage(data)
    if (!lastPageLastDoc) return
    setPageStartAfterTrace(currentState => ({
      ...currentState,
      [size]: lastPageLastDoc,
    }))
  }, [data, size])

  useEffect(() => {
    setPageStartAfterTrace({})
  }, [viewMode])

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

  const flattenedData = data?.flat() ?? []
  const replies = viewMode === 'end' ? reverse(flattenedData) : flattenedData
  const isValidating = repliesAreValidating || postIsValidating

  const moreToLoad =
    post?.data.postsCount === undefined || replies.length < post.data.postsCount

  const refresh = async () => {
    await mutate()
  }

  return {
    error,
    isLoading,
    isValidating,
    likePost,
    loadMore,
    moreToLoad,
    refresh,
    replies,
    watchPost,
  }
}

export default usePostReplies
