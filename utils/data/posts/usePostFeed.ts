import { useCallback } from 'react'
import { MutatorCallback } from 'swr'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { FeedSortMode, Post } from '../../../types'
import { createPostFeedSWRGetKey } from '../../createCacheKeys'
import getPostFeed from './getPostFeed'
import constants from '../../../constants'
import { mutatePostLikeInfiniteData } from '../utils/mutatePostLike'
import type { InfiniteData } from '../types'
import checkUserLikesPost from '../utils/checkUserLikesPost'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import checkUserWatchingPost from '../utils/checkUserWatchingPost'
import updateWatchedPostInServer from '../utils/updateWatchedPostInServer'
import { mutateWatchedPostInfiniteData } from '../utils/mutateWatchedPost'
import { ReactionId } from '../../../types/Reaction'
import updatePostReactionInServer from '../utils/updatePostReactionInServer'
import getPost from '../post/getPost'
import useAuth from '../../auth/useAuth'

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: false,
}

type UsePostFeed = (options?: {
  sortMode?: FeedSortMode
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<void>
  moreToLoad: boolean
  posts: Post[]
  reactToPost: (reaction: ReactionId | undefined, slug: string) => Promise<void>
  watchPost: (documentPath: string) => Promise<void>
}

const usePostFeed: UsePostFeed = ({
  sortMode = FeedSortMode.Latest,
  swrConfig = {},
} = {}) => {
  const { uid } = useAuth()

  const {
    data: pages,
    error,
    isLoading,
    isValidating,
    mutate,
    setSize,
  } = useSWRInfinite(
    createPostFeedSWRGetKey({ sortMode, uid }),
    ({ startAfter }) =>
      getPostFeed({
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
    await setSize(currentSize => currentSize + 1)
  }

  const posts = pages?.flat() ?? []
  const moreToLoad = pages?.at?.(-1)?.length === POST_PAGINATION_COUNT

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

  const reactToPost = useCallback(
    async (reaction: ReactionId | undefined, slug: string) => {
      const handleMutation: MutatorCallback<
        InfiniteData
      > = async currentData => {
        if (!currentData) {
          return currentData
        }

        const test = currentData.flat().find(post => post.data.slug === slug)

        if (test?.user?.reaction === reaction) {
          return currentData
        }

        await updatePostReactionInServer(reaction, slug)
        const updatedPost = await getPost(slug, { uid })

        if (!updatedPost) {
          return currentData
        }

        const newData: InfiniteData = currentData.map(posts =>
          posts.map(post => {
            if (post.data.slug !== slug) return post
            return updatedPost
          })
        )

        return newData
      }

      await mutate(handleMutation, false)
    },
    [mutate, uid]
  )

  return {
    error,
    isLoading: isLoading || !uid, // Since this is only used on authenticated routes, we can show loading state until we have a uid
    isValidating,
    likePost,
    loadMore,
    moreToLoad,
    posts,
    reactToPost,
    watchPost,
  }
}

export default usePostFeed
