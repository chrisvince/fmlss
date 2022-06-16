import { useAuthUser } from 'next-firebase-auth'
import useSWR, { KeyedMutator } from 'swr'
import { Post } from '../../../types'
import getPostFeed from './getPostFeed'

type UsePostFeed = () => {
  posts: Post[]
  isLoading: boolean
  error: any
  isValidating: boolean
  mutate: KeyedMutator<Post[]>
}

const usePostFeed: UsePostFeed = () => {
  const { id: uid } = useAuthUser()
  const { data, error, isValidating, mutate } = useSWR(
    'feed',
    () => getPostFeed({ uid }),
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

export default usePostFeed
