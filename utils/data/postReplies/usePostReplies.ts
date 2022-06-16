import { useAuthUser } from 'next-firebase-auth'
import useSWR, { KeyedMutator } from 'swr'
import { Post } from '../../../types'
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

const usePostReplies: UsePostReplies = (reference) => {
  const { id: uid } = useAuthUser()
  const key = `${reference}/posts`
  const { data, error, isValidating, mutate } = useSWR(
    key,
    () => getPostReplies(reference, { uid }),
    { revalidateOnFocus: false },
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
