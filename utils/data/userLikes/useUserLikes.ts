import { useAuthUser } from 'next-firebase-auth'
import { useCallback, useEffect, useState } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { MutatorCallback, useSWRConfig } from 'swr'

import { FirebaseDoc, Post } from '../../../types'
import {
  createUserLikesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getUserLikes from './getUserLikes'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'
import checkUserLikesPost from '../utils/checkUserLikesPost'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import { mutatePostLikeInfiniteData } from '../utils/mutatePostLike'
import { InfiniteData } from '../types'
import checkUserWatchingPost from '../utils/checkUserWatchingPost'
import updateWatchedPostInServer from '../utils/updateWatchedPostInServer'
import { mutateWatchedPostInfiniteData } from '../utils/mutateWatchedPost'

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UseUserLikes = (options?: { swrConfig?: SWRInfiniteConfiguration }) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  posts: Post[]
  watchPost: (documentPath: string) => Promise<void>
}

const useUserLikes: UseUserLikes = ({ swrConfig = {} } = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { id: uid } = useAuthUser()
  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createUserLikesCacheKey(uid!)]

  if (!uid) {
    console.error('uid must be set.')
  }

  const { data, error, isLoading, isValidating, mutate, size, setSize } =
    useSWRInfinite(
      (index, previousPageData) => {
        if (
          previousPageData &&
          previousPageData.length < POST_PAGINATION_COUNT
        ) {
          return null
        }
        return createUserLikesCacheKey(uid!, { pageIndex: index })
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
  const lastPageLength = data?.at?.(-1)?.length

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

export default useUserLikes
