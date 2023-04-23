import { useAuthUser } from 'next-firebase-auth'
import { useCallback } from 'react'
import useSWR, { MutatorCallback, SWRConfiguration } from 'swr'
import { Post } from '../../../types'
import { createPostCacheKey } from '../../createCacheKeys'
import { mutatePostLike } from '../utils/mutatePostLike'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import getPost from './getPost'

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
}

const usePost: UsePost = (slug, { swrConfig = {} } = {}) => {
  const { id: uid } = useAuthUser()
  const postCacheKey = createPostCacheKey(slug)

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

  return {
    error,
    isLoading,
    isValidating,
    likePost,
    post: data,
  }
}

export default usePost
