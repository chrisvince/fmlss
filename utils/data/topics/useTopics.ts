import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { TopicsSortMode, Topic } from '../../../types'
import { createTopicsSWRGetKey } from '../../createCacheKeys'
import getTopics from './getTopics'
import constants from '../../../constants'

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UseTopics = (options?: {
  limit?: number
  parentRef?: string
  skip?: boolean
  sortMode?: TopicsSortMode
  swrConfig?: SWRInfiniteConfiguration
}) => {
  topics: Topic[]
  error: unknown
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Topic[]>
  moreToLoad: boolean
}

const useTopics: UseTopics = ({
  limit = POST_PAGINATION_COUNT,
  parentRef: parentTopicRef,
  skip = false,
  sortMode = TopicsSortMode.Popular,
  swrConfig = {},
} = {}) => {
  const {
    data: pages,
    error,
    isLoading,
    isValidating,
    setSize,
    size,
  } = useSWRInfinite(
    createTopicsSWRGetKey({
      limit,
      parentTopicRef,
      skip,
      sortMode,
    }),
    ({ startAfter }) =>
      getTopics({
        sortMode,
        startAfter,
        parentTopicRef,
        limit,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  const loadMore = async () => {
    const data = await setSize(size + 1)
    return data?.flat() ?? []
  }

  const topics = pages?.flat() ?? []
  const moreToLoad = pages?.at?.(-1)?.length === POST_PAGINATION_COUNT

  return {
    topics,
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
  }
}

export default useTopics
