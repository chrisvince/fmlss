import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { FirebaseDoc, Hashtag, HashtagsSortMode } from '../../../types'
import {
  createHashtagsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import getHashtags from './getHashtags'
import constants from '../../../constants'

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UseHashtags = (options?: {
  sortMode?: HashtagsSortMode
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Hashtag[]>
  hashtags: Hashtag[]
  moreToLoad: boolean
}

const useHashtags: UseHashtags = ({
  sortMode = HashtagsSortMode.Latest,
  swrConfig = {},
} = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createHashtagsCacheKey(sortMode)]

  const { data, error, isLoading, isValidating, setSize, size } =
    useSWRInfinite(
      (index, previousPageData) => {
        if (
          previousPageData &&
          previousPageData.length < POST_PAGINATION_COUNT
        ) {
          return null
        }
        return createHashtagsCacheKey(sortMode, index)
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        return getHashtags({
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

  const hashtags = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= POST_PAGINATION_COUNT

  return {
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
    hashtags,
  }
}

export default useHashtags
