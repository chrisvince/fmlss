import { useAuthUser } from 'next-firebase-auth'
import useSWR, { KeyedMutator } from 'swr'
import { Post } from '../../../types'
import { createPostCacheKey } from '../../createCacheKeys'
import getPost from './getPost'

type UsePost = (
  slug: string,
) => {
  post: Post
  isLoading: boolean
  error: any
  isValidating: boolean
  mutate: KeyedMutator<Post>
}

const usePost: UsePost = (slug) => {
  const { id: uid } = useAuthUser()
  const postCacheKey = createPostCacheKey(slug)

  const { data, error, isValidating, mutate } = useSWR(
    postCacheKey,
    () => getPost(slug, { uid }),
    { revalidateOnFocus: false },
  )

  return {
    post: data as Post,
    isLoading: !error && !data,
    isValidating,
    error,
    mutate,
  }
}

export default usePost
