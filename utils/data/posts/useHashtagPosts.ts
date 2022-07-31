import { useAuthUser } from 'next-firebase-auth'
import { useCallback, useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { useSWRConfig } from 'swr'

import { HashtagSortMode, FirebaseDoc, Post } from '../../../types'
import {
  createHashtagPostsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getHashtagPosts from './getHashtagPosts'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'
import { InfiniteData } from '../types'
import updatePostLikeInServer from '../utils/data-infinite-loading/updatePostLikeInServer'
import checkUserLikesPost from '../utils/data-infinite-loading/checkUserLikesPost'
import mutatePostLikeInData from '../utils/data-infinite-loading/mutatePostLikeInData'

const { PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
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
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
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
    mutate,
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
  const lastPageLength = data?.at?.(-1)?.length ?? 0
  const isLoading = !error && !data
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
  }
}

export default useHashtagPosts
