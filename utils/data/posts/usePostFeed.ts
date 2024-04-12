import { useAuthUser } from 'next-firebase-auth'
import { useCallback, useEffect, useState } from 'react'
import { MutatorCallback, useSWRConfig } from 'swr'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { FeedSortMode, FirebaseDoc, Post } from '../../../types'
import {
  createPostFeedCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
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

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: true,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UsePostFeed = (options?: {
  sortMode?: FeedSortMode
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  likePost: (slug: string) => Promise<void>
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  posts: Post[]
  reactToPost: (reaction: ReactionId | undefined, slug: string) => Promise<void>
  watchPost: (documentPath: string) => Promise<void>
}

const usePostFeed: UsePostFeed = ({
  sortMode = FeedSortMode.Latest,
  swrConfig = {},
} = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createPostFeedCacheKey(sortMode)]
  const { id: uid } = useAuthUser()

  const { data, error, isLoading, isValidating, mutate, setSize, size } =
    useSWRInfinite(
      (index, previousPageData) => {
        if (
          previousPageData &&
          previousPageData.length < POST_PAGINATION_COUNT
        ) {
          return null
        }
        return createPostFeedCacheKey(sortMode, { pageIndex: index })
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        return getPostFeed({
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

  const posts = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= POST_PAGINATION_COUNT

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
    isLoading,
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
