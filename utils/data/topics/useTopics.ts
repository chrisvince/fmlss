import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { TopicsSortMode, Topic, FirebaseDoc } from '../../../types'
import {
  createTopicsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
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

const useTopics: UseTopics = ({ sortMode = 'latest', swrConfig = {} } = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createTopicsCacheKey(sortMode)]

  const { data, error, isLoading, isValidating, setSize, size } =
    useSWRInfinite(
      (index, previousPageData) => {
        if (
          previousPageData &&
          previousPageData.length < POST_PAGINATION_COUNT
        ) {
          return null
        }
        return createTopicsCacheKey(sortMode, index)
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        return getTopics({
          sortMode,
          startAfter: pageStartAfterTrace[pageIndex],
        })
      },
      {
        fallbackData,
        ...DEFAULT_SWR_CONFIG,
        ...swrConfig,
      }
    )

  const lastPageLastDoc = getLastDocOfLastPage(data)
  useEffect(() => {
    if (!lastPageLastDoc) return
    setPageStartAfterTrace(currentState => ({
      ...currentState,
      [size]: lastPageLastDoc,
    }))
  }, [lastPageLastDoc, size])

  const loadMore = async () => {
    const data = await setSize(size + 1)
    return data?.flat() ?? []
  }

  const topics = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= POST_PAGINATION_COUNT

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
