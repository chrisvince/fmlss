import { useCallback } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { MutatorCallback } from 'swr'

import { Post } from '../../../types'
import { createPostRepliesSWRGetKey } from '../../createCacheKeys'
import usePost from '../post/usePost'
import getPostReplies from './getPostReplies'
import constants from '../../../constants'
import checkUserLikesPost from '../utils/checkUserLikesPost'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import { mutatePostLikeInfiniteData } from '../utils/mutatePostLike'
import { InfiniteData } from '../types'
import updateWatchedPostInServer from '../utils/updateWatchedPostInServer'
import { mutateWatchedPostInfiniteData } from '../utils/mutateWatchedPost'
import checkUserWatchingPost from '../utils/checkUserWatchingPost'
import useAuth from '../../auth/useAuth'

const { POST_REPLIES_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: false,
}

const usePostReplies = (
  slug?: string
): {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  likePost: (documentPath: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  refresh: () => Promise<void>
  replies: Post[]
  watchPost: (slug: string) => Promise<void>
} => {
  const { uid } = useAuth()
  const { post, isValidating: postIsValidating } = usePost(slug)

  const {
    data: pages,
    error,
    isLoading,
    isValidating: repliesAreValidating,
    mutate,
    setSize,
    size,
  } = useSWRInfinite(
    createPostRepliesSWRGetKey({ slug: post?.data.slug, uid }),
    ({ startAfter }) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getPostReplies(post!.data.reference, {
        uid,
        startAfter,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
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

  const replies = pages?.flat() ?? []
  const isValidating = repliesAreValidating || postIsValidating
  const moreToLoad = pages?.at?.(-1)?.length === POST_REPLIES_PAGINATION_COUNT

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
