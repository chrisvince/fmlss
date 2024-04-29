import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { createPeopleSWRGetKey } from '../../createCacheKeys'
import getPeople from './getPeople'
import constants from '../../../constants'
import { Person } from '../../../types/Person'
import { PeopleSortMode } from '../../../types/PeopleSortMode'

const { PEOPLE_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UsePeople = (options?: {
  swrConfig?: SWRInfiniteConfiguration
  sortMode?: PeopleSortMode
}) => {
  people: Person[]
  error: unknown
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Person[]>
  moreToLoad: boolean
}

const usePeople: UsePeople = ({
  swrConfig = {},
  sortMode = PeopleSortMode.Popular,
} = {}) => {
  const {
    data: pages,
    error,
    isLoading,
    isValidating,
    setSize,
    size,
  } = useSWRInfinite(
    createPeopleSWRGetKey({ sortMode }),
    ({ startAfter }) =>
      getPeople({
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

  const people = pages?.flat() ?? []
  const moreToLoad = pages?.at?.(-1)?.length === PEOPLE_PAGINATION_COUNT

  return {
    people,
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
  }
}

export default usePeople
