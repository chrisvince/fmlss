import { useCallback, useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { MutatorCallback, useSWRConfig } from 'swr'

import { FirebaseDoc, Post } from '../../../types'
import {
  createPersonPostsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'
import { InfiniteData } from '../types'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import checkUserLikesPost from '../utils/checkUserLikesPost'
import { mutatePostLikeInfiniteData } from '../utils/mutatePostLike'
import { mutateWatchedPostInfiniteData } from '../utils/mutateWatchedPost'
import updateWatchedPostInServer from '../utils/updateWatchedPostInServer'
import checkUserWatchingPost from '../utils/checkUserWatchingPost'
import getPersonPosts from './getPersonPosts'
import { PersonPostsSortMode } from '../../../types/PersonPostsSortMode'
import useAuth from '../../auth/useAuth'

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UsePersonPosts = (
  slug: string,
  options?: {
    sortMode?: PersonPostsSortMode
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

const usePersonPosts: UsePersonPosts = (
  slug,
  { sortMode = PersonPostsSortMode.Popular, swrConfig = {} } = {}
) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createPersonPostsCacheKey(slug, { sortMode })]
  const { uid } = useAuth()

  const { data, error, isLoading, isValidating, mutate, setSize, size } =
    useSWRInfinite(
      (pageIndex, previousPageData) => {
        if (
          !uid ||
          (previousPageData && previousPageData.length < POST_PAGINATION_COUNT)
        ) {
          return null
        }
        return createPersonPostsCacheKey(slug, { pageIndex, sortMode })
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        if (!uid) return []

        return getPersonPosts(slug, {
          sortMode,
          startAfter: pageStartAfterTrace[pageIndex],
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

export default usePersonPosts
