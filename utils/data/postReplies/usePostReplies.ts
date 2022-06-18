import { useAuthUser } from 'next-firebase-auth'
import useSWR, { KeyedMutator } from 'swr'
import { Post } from '../../../types'
import { createPostRepliesCacheKey } from '../../createCacheKeys'
import usePost from '../post/usePost'
import getPostReplies from './getPostReplies'

type UsePostReplies = (
  reference: string,
) => {
  replies: Post[]
  isLoading: boolean
  error: any
  isValidating: boolean
  mutate: KeyedMutator<Post[]>
}

const usePostReplies: UsePostReplies = (slug) => {
  const { id: uid } = useAuthUser()
  const { post } = usePost(slug)
  const postRepliesCacheKey = createPostRepliesCacheKey(slug)

  const { data, error, isValidating, mutate } = useSWR(
    postRepliesCacheKey,
    () => getPostReplies(post.data.reference, slug, { uid }),
    { revalidateOnFocus: false }
  )

  return {
    replies: data as Post[],
    isLoading: !error && !data,
    isValidating,
    error,
    mutate,
  }
}

export default usePostReplies
