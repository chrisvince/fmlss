import { useAuthUser } from 'next-firebase-auth'
import useSWR, { KeyedMutator } from 'swr'
import { FetcherResponse, PublicConfiguration } from 'swr/dist/types'
import { Post } from '../../../types'
import { createPostCacheKey } from '../../createCacheKeys'
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
  slug: string,
  options?: {
    swrConfig?: SWRConfig,
  },
) => {
  post: Post
  isLoading: boolean
  error: any
  isValidating: boolean
  mutate: KeyedMutator<Post>
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

  return {
    post: data as Post,
    isLoading: !error && !data,
    isValidating,
    error,
    mutate: mutate as KeyedMutator<Post>,
  }
}

export default usePost
