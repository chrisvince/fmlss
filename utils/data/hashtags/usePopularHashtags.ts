import useSWR, { SWRConfiguration } from 'swr'
import { SWRInfiniteConfiguration } from 'swr/infinite'

import { Hashtag } from '../../../types'
import { createMiniHashtagsCacheKey } from '../../createCacheKeys'
import getHashtags from './getHashtags'
import constants from '../../../constants'

const { MINI_LIST_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UsePopularHashtags = (options?: {
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: any
  hashtags: Hashtag[]
  isLoading: boolean
  isValidating: boolean
}

const usePopularHashtags: UsePopularHashtags = ({ swrConfig = {} } = {}) => {
  const cacheKey = createMiniHashtagsCacheKey()

  const { data, error, isValidating } = useSWR(
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
    error,
    hashtags: data,
    isLoading: !error && !data,
    isValidating,
  }
}

export default usePopularHashtags
