import { useAuthUser } from 'next-firebase-auth'
import useSWR, { KeyedMutator } from 'swr'
import { Post } from '../../../types'
import getHashtagPosts from './getHashtagPosts'
import getPostFeed from './getPostFeed'

type UsePostFeed = (hashtag: string) => {
  posts: Post[]
  isLoading: boolean
  error: any
  isValidating: boolean
  mutate: KeyedMutator<Post[]>
}

const useHashtagPosts: UsePostFeed = hashtag => {
  const { id: uid } = useAuthUser()
  const { data, error, isValidating, mutate } = useSWR(
    `hashtag/${hashtag}`,
    () => getHashtagPosts(hashtag, { uid }),
    { revalidateOnMount : false }
  )

  return {
    posts: data as Post[],
    isLoading: !error && !data,
    isValidating,
    error,
    mutate,
  }
}

export default useHashtagPosts
