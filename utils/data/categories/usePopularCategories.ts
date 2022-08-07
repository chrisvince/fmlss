import useSWR, { KeyedMutator } from 'swr'
import { SWRInfiniteConfiguration } from 'swr/infinite'

import { Category } from '../../../types'
import { createMiniCategoriesCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import { FetcherResponse, PublicConfiguration } from 'swr/dist/types'
import getCategories from './getCategories'

const { MINI_LIST_COUNT } = constants

type SWRConfig = Partial<
  PublicConfiguration<
    Category | null,
    any,
    (args_0: string) => FetcherResponse<Category | null>
  >
>

const DEFAULT_SWR_CONFIG: SWRConfig = {
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
