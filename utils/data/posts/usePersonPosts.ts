import { useCallback } from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { MutatorCallback } from 'swr'

import { Post } from '../../../types'
import { createPersonPostsSWRGetKey } from '../../createCacheKeys'
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
    createPersonPostsSWRGetKey({ slug, sortMode, uid }),
    ({ startAfter }) =>
      getPersonPosts(slug, {
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

export default usePersonPosts
