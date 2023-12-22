import useSWR, { SWRConfiguration } from 'swr'

import { Topic } from '../../../types'
import { createTopicCacheKey } from '../../createCacheKeys'
import getTopic from './getTopic'

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
}

type UseTopic = (
  path: string | null,
  options?: {
    swrConfig?: SWRConfiguration
  }
) => {
  topic: Topic | null | undefined
  isLoading: boolean
  error: unknown
  isValidating: boolean
}

const useTopic: UseTopic = (path, { swrConfig = {} } = {}) => {
  const topicCacheKey = path ? createTopicCacheKey(path) : null

  const { data, error, isLoading, isValidating } = useSWR(
    topicCacheKey,
    () => getTopic(path!),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    topic: data,
    error,
    isLoading,
    isValidating,
  }
}

export default useTopic
