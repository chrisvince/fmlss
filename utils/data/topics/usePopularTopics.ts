import useSWR, { SWRConfiguration } from 'swr'
import { SWRInfiniteConfiguration } from 'swr/infinite'

import { Topic, TopicsSortMode } from '../../../types'
import { createSidebarTopicsCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import getTopics from './getTopics'

const { SIDEBAR_LIST_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UsePopularTopics = (options?: {
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  topics: Topic[]
}

const usePopularTopics: UsePopularTopics = ({ swrConfig = {} } = {}) => {
  const cacheKey = createSidebarTopicsCacheKey()

  const { data, error, isLoading, isValidating } = useSWR(
    cacheKey,
    () =>
      getTopics({
        sortMode: TopicsSortMode.Popular,
        limit: SIDEBAR_LIST_COUNT,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    topics: data ?? [],
    error,
    isLoading,
    isValidating,
  }
}

export default usePopularTopics
