import useSWR, { SWRConfiguration } from 'swr'
import { SWRInfiniteConfiguration } from 'swr/infinite'

import { Category } from '../../../types'
import { createMiniCategoriesCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import getCategories from './getCategories'

const { MINI_LIST_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UsePopularCategories = (options?: {
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  categories: Category[]
}

const usePopularCategories: UsePopularCategories = ({
  swrConfig = {},
} = {}) => {
  const cacheKey = createMiniCategoriesCacheKey()

  const { data, error, isValidating } = useSWR(
    cacheKey,
    () =>
      getCategories({
        sortMode: 'popular',
        limit: MINI_LIST_COUNT,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    categories: data,
    error,
    isLoading: !error && !data,
    isValidating,
  }
}

export default usePopularCategories
