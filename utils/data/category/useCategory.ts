import useSWR, { KeyedMutator } from 'swr'
import { FetcherResponse, PublicConfiguration } from 'swr/dist/types'

import { Category } from '../../../types'
import { createCategoryCacheKey } from '../../createCacheKeys'
import getCategory from './getCategory'

type SWRConfig = Partial<
  PublicConfiguration<
    Category | null,
    any,
    (args_0: string) => FetcherResponse<Category | null>
  >
>

const DEFAULT_SWR_CONFIG: SWRConfig = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnMount: false,
  revalidateOnReconnect: false,
}

type UseCategory = (
  slug: string,
  options?: {
    swrConfig?: SWRConfig
  }
) => {
  category: Category | null | undefined
  isLoading: boolean
  error: any
  isValidating: boolean
}

const useCategory: UseCategory = (slug, { swrConfig = {} } = {}) => {
  const categoryCacheKey = createCategoryCacheKey(slug)

  const { data, error, isValidating } = useSWR(
    categoryCacheKey,
    () => getCategory(slug),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    category: data,
    error,
    isLoading: !error && !data,
    isValidating,
  }
}

export default useCategory
