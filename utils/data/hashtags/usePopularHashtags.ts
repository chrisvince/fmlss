import useSWR, { SWRConfiguration } from 'swr'
import { SWRInfiniteConfiguration } from 'swr/infinite'

import { Hashtag } from '../../../types'
import { createSidebarHashtagsCacheKey } from '../../createCacheKeys'
import getHashtags from './getHashtags'
import constants from '../../../constants'

const { SIDEBAR_LIST_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UsePopularHashtags = (options?: {
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: unknown
  hashtags: Hashtag[]
  isLoading: boolean
  isValidating: boolean
}

const usePopularHashtags: UsePopularHashtags = ({ swrConfig = {} } = {}) => {
  const cacheKey = createSidebarHashtagsCacheKey()

  const { data, error, isLoading, isValidating } = useSWR(
    cacheKey,
    () =>
      getHashtags({
        sortMode: 'popular',
        limit: SIDEBAR_LIST_COUNT,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    error,
    hashtags: data ?? [],
    isLoading,
    isValidating,
  }
}

export default usePopularHashtags
