import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { Hashtag, HashtagsSortMode } from '../../../types'
import { createHashtagSWRGetKey } from '../../createCacheKeys'
import getHashtags from './getHashtags'
import constants from '../../../constants'

const { HASHTAGS_PAGINATION_COUNT } = constants

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
  const { data, error, isLoading, isValidating, setSize, size } =
    useSWRInfinite(
      createHashtagSWRGetKey({ sortMode }),
      ({ startAfter }) =>
        getHashtags({
          sortMode,
          startAfter,
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

  const hashtags = data?.flat() ?? []
  const moreToLoad = data?.at?.(-1)?.length >= HASHTAGS_PAGINATION_COUNT

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
