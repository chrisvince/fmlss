import useSWR, { SWRConfiguration } from 'swr'
import { SWRInfiniteConfiguration } from 'swr/infinite'

import { Person, PeopleSortMode } from '../../../types'
import { createSidebarPeopleCacheKey } from '../../createCacheKeys'
import constants from '../../../constants'
import getPeople from './getPeople'

const { SIDEBAR_LIST_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UsePopularPeople = (options?: {
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: unknown
  people: Person[]
  isLoading: boolean
  isValidating: boolean
}

const usePopularPeople: UsePopularPeople = ({ swrConfig = {} } = {}) => {
  const cacheKey = createSidebarPeopleCacheKey()

  const { data, error, isLoading, isValidating } = useSWR(
    cacheKey,
    () =>
      getPeople({
        limit: SIDEBAR_LIST_COUNT,
        sortMode: PeopleSortMode.Popular,
      }),
    {
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  return {
    error,
    people: data ?? [],
    isLoading,
    isValidating,
  }
}

export default usePopularPeople
