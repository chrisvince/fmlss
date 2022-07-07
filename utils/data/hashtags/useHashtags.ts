import { useEffect, useState } from 'react'
import { KeyedMutator, useSWRConfig } from 'swr'
import useSWRInfinite from 'swr/infinite'

import { FirebaseDoc, Hashtag, HashtagsSortMode } from '../../../types'
import {
  createHashtagsCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import getHashtags from './getHashtags'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

type UseHashtags = (options?: { sortMode?: HashtagsSortMode }) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Hashtag[]>
  mutate: KeyedMutator<Hashtag[]>
  hashtags: Hashtag[]
  moreToLoad: boolean
}

const useHashtags: UseHashtags = ({ sortMode = 'latest' } = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createHashtagsCacheKey(sortMode)]

  const {
    data,
    error,
    isValidating,
    mutate: mutateOriginal,
    size,
    setSize,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && previousPageData.length < PAGINATION_COUNT) {
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
      revalidateOnMount: true,
      revalidateOnFocus: false,
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

  const mutate = async () => {
    const data = await mutateOriginal()
    return data?.flat() ?? []
  }

  const hashtags = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length
  const isLoading = !error && !data
  const moreToLoad = !isValidating && (
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT
  )

  return {
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
    mutate,
    hashtags,
  }
}

export default useHashtags
