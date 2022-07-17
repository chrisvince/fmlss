import useSWR, { KeyedMutator } from 'swr'
import { SWRInfiniteConfiguration } from 'swr/infinite'

import { Hashtag } from '../../../types'
import { createMiniHashtagsCacheKey } from '../../createCacheKeys'
import getHashtags from './getHashtags'
import constants from '../../../constants'
import { FetcherResponse, PublicConfiguration } from 'swr/dist/types'

const { MINI_LIST_COUNT } = constants

type SWRConfig = Partial<
  PublicConfiguration<
    Hashtag | null,
    any,
    (args_0: string) => FetcherResponse<Hashtag | null>
  >
>

const DEFAULT_SWR_CONFIG: SWRConfig = {
  revalidateOnFocus: false,
}

type UsePopularHashtags = (options?: {
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  mutate: KeyedMutator<Hashtag[]>
  hashtags: Hashtag[]
}

const usePopularHashtags: UsePopularHashtags = ({
  swrConfig = {},
} = {}) => {
  const cacheKey = createMiniHashtagsCacheKey()

  const { data, error, isValidating, mutate } = useSWR(
    cacheKey,
    () =>
      getHashtags({
        sortMode: 'popular',
        limit: MINI_LIST_COUNT,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    hashtags: data as Hashtag[],
    isLoading: !error && !data,
    isValidating,
    error,
    mutate: mutate as KeyedMutator<Hashtag[]>,
  }
}

export default usePopularHashtags
