import useSWR, { SWRConfiguration } from 'swr'
import { SWRInfiniteConfiguration } from 'swr/infinite'

import { Category } from '../../../types'
import { createSidebarCategoriesCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import getCategories from './getCategories'

const { SIDEBAR_LIST_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UsePopularCategories = (options?: {
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  categories: Category[]
}

const usePopularCategories: UsePopularCategories = ({
  swrConfig = {},
} = {}) => {
  const cacheKey = createSidebarCategoriesCacheKey()

  const { data, error, isLoading, isValidating } = useSWR(
    cacheKey,
    () =>
      getCategories({
        sortMode: 'popular',
        limit: SIDEBAR_LIST_COUNT,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    categories: data ?? [],
    error,
    isLoading,
    isValidating,
  }
}

export default usePopularCategories
