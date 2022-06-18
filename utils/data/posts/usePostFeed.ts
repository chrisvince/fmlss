import { useAuthUser } from 'next-firebase-auth'
import useSWR, { KeyedMutator } from 'swr'
import { Post } from '../../../types'
import { createPostFeedCacheKey } from '../../createCacheKeys'
import getPostFeed from './getPostFeed'

type UsePostFeed = () => {
  posts: Post[]
  isLoading: boolean
  error: any
  isValidating: boolean
  mutate: KeyedMutator<Post[]>
}

const postFeedCacheKey = createPostFeedCacheKey()

const usePostFeed: UsePostFeed = () => {
  const { id: uid } = useAuthUser()
  const { data, error, isValidating, mutate } = useSWR(
    postFeedCacheKey,
    () => getPostFeed({ uid }),
    { revalidateOnMount: false }
  )

  return {
    posts: data as Post[],
    isLoading: !error && !data,
    isValidating,
    error,
    mutate,
  }
}

export default usePostFeed
