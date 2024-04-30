import { useCallback } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { MutatorCallback } from 'swr'

import { HashtagSortMode, Post } from '../../../types'
import { createHashtagPostsSWRGetKey } from '../../createCacheKeys'
import getHashtagPosts from './getHashtagPosts'
import constants from '../../../constants'
import { InfiniteData } from '../types'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import checkUserLikesPost from '../utils/checkUserLikesPost'
import { mutatePostLikeInfiniteData } from '../utils/mutatePostLike'
import { mutateWatchedPostInfiniteData } from '../utils/mutateWatchedPost'
import updateWatchedPostInServer from '../utils/updateWatchedPostInServer'
import checkUserWatchingPost from '../utils/checkUserWatchingPost'
import useAuth from '../../auth/useAuth'
import { PostTypeQuery } from '../../../types/PostTypeQuery'

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
    showType?: PostTypeQuery
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
    showType = PostTypeQuery.Post,
    sortMode = HashtagSortMode.Latest,
    swrConfig = {},
  } = {}
) => {
  const { uid } = useAuth()

  const {
    data: pages,
    error,
    isLoading,
    isValidating,
    mutate,
    setSize,
    size,
  } = useSWRInfinite(
    createHashtagPostsSWRGetKey({
      showType,
      slug,
      sortMode,
      uid,
    }),
    ({ startAfter }) =>
      getHashtagPosts(slug, {
        showType,
        sortMode,
        startAfter,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        uid: uid!,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

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

  const posts = pages?.flat() ?? []
  const moreToLoad = pages?.at?.(-1)?.length === POST_PAGINATION_COUNT

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
