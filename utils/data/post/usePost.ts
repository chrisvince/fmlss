import { useAuthUser } from 'next-firebase-auth'
import { useCallback } from 'react'
import useSWR, { MutatorCallback, SWRConfiguration } from 'swr'
import { Post } from '../../../types'
import { createPostCacheKey } from '../../createCacheKeys'
import { mutatePostLike } from '../utils/mutatePostLike'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import getPost from './getPost'
import updateWatchedPostInServer from '../utils/updateWatchedPostInServer'
import { mutateWatchedPost } from '../utils/mutateWatchedPost'
import { ReactionId } from '../../../types/Reaction'
import updatePostReactionInServer from '../utils/updatePostReactionInServer'

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
}

type UsePost = (
  slug?: string | null,
  options?: {
    swrConfig?: SWRConfiguration
  }
) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  likePost: () => Promise<void>
  post: Post | null | undefined
  reactToPost: (reaction: ReactionId | undefined) => Promise<void>
  watchPost: () => Promise<void>
}

const usePost: UsePost = (slug, { swrConfig = {} } = {}) => {
  const { id: uid } = useAuthUser()
  const postCacheKey = slug ? createPostCacheKey(slug) : undefined

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    postCacheKey,
    () => getPost(slug, { uid }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  const likePost = useCallback(async () => {
    const handleMutation: MutatorCallback<Post | null> = async post => {
      if (!post) return
      const userLikesPost = !!post.user?.like
      await updatePostLikeInServer(userLikesPost, post.data.slug)
      const mutatedData = mutatePostLike(userLikesPost, post)
      return mutatedData
    }

    await mutate(handleMutation, false)
  }, [mutate])

  const watchPost = useCallback(async () => {
    const handleMutation: MutatorCallback<Post | null> = async post => {
      if (!post) return
      const userIsWatchingPost = !!post.user?.watching
      await updateWatchedPostInServer(userIsWatchingPost, post.data.slug)
      const mutatedData = mutateWatchedPost(userIsWatchingPost, post)
      return mutatedData
    }

    await mutate(handleMutation, false)
  }, [mutate])

  const reactToPost = useCallback(
    async (reaction: ReactionId | undefined) => {
      const handleMutation: MutatorCallback<Post | null> = async post => {
        if (!post || post.user?.reaction === reaction) {
          return post
        }

        await updatePostReactionInServer(reaction, post.data.slug)
        const updatedPost = await getPost(post.data.slug, { uid })
        return updatedPost
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
    post: data,
    reactToPost,
    watchPost,
  }
}

export default usePost
