import { useAuthUser } from 'next-firebase-auth'
import { useCallback } from 'react'
import useSWR from 'swr'
import {
  FetcherResponse,
  MutatorCallback,
  PublicConfiguration,
} from 'swr/dist/types'
import { Post } from '../../../types'
import { createPostCacheKey } from '../../createCacheKeys'
import { mutatePostLike } from '../utils/mutatePostLike'
import updatePostLikeInServer from '../utils/updatePostLikeInServer'
import getPost from './getPost'

type SWRConfig = Partial<
  PublicConfiguration<
    Post | null,
    any,
    (args_0: string) => FetcherResponse<Post | null>
  >
>

const DEFAULT_SWR_CONFIG: SWRConfig = {
  revalidateOnFocus: false,
}

type UsePost = (
  slug?: string | null,
  options?: {
    swrConfig?: SWRConfig,
  },
) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  likePost: () => Promise<void>
  post: Post | null | undefined
}

const usePost: UsePost = (slug, { swrConfig = {} } = {}) => {
  const { id: uid } = useAuthUser()
  const postCacheKey = createPostCacheKey(slug)

  const { data, error, isValidating, mutate } = useSWR(
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
    isLoading: !error && !data,
    isValidating,
    likePost,
    post: data,
  }
}

export default usePost
