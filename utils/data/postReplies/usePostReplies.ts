import { useCallback, useEffect, useState } from 'react'
import { useAuthUser } from 'next-firebase-auth'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { useSWRConfig } from 'swr'
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

type UsePostReplies = (
  slug: string,
  options?: {
    viewMode?: 'start' | 'end'
    swrConfig?: SWRInfiniteConfiguration
  },
) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  replies: Post[]
}

const usePostReplies: UsePostReplies = (
  slug,
  {
    viewMode = 'start',
    swrConfig = {},
  } = {},
) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createPostRepliesCacheKey(slug, 0, viewMode)]
  const { id: uid } = useAuthUser()
  const { post, isValidating: postIsValidating } = usePost(slug)

  const {
    data,
    error,
    isValidating: repliesAreValidating,
    mutate,
    size,
    setSize,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (
        (previousPageData && previousPageData.length < PAGINATION_COUNT) ||
        !post
      ) {
        return null
      }
      return createPostRepliesCacheKey(slug, index, viewMode)
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getPostReplies(post!.data.reference, slug, {
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

  const flattenedData = data?.flat() ?? []
  const replies = viewMode === 'end' ? reverse(flattenedData) : flattenedData
  const isLoading = !error && !data
  const isValidating = repliesAreValidating || postIsValidating

  const moreToLoad =
    post?.data.postsCount === undefined || replies.length < post.data.postsCount

  return {
    error,
    isLoading,
    isValidating,
    likePost,
    loadMore,
    moreToLoad,
    replies,
  }
}

export default usePostReplies
