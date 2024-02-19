import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { FirebaseDoc } from '../../../types'
import {
  createPeopleCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import getPeople from './getPeople'
import constants from '../../../constants'
import { Person } from '../../../types/Person'

const { PEOPLE_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
  revalidateFirstPage: false,
  revalidateAll: true,
}

type UsePeople = (options?: { swrConfig?: SWRInfiniteConfiguration }) => {
  people: Person[]
  error: unknown
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Person[]>
  moreToLoad: boolean
}

const usePeople: UsePeople = ({ swrConfig = {} } = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createPeopleCacheKey()]

  const { data, error, isLoading, isValidating, setSize, size } =
    useSWRInfinite(
      (pageIndex, previousPageData) => {
        if (
          previousPageData &&
          previousPageData.length < PEOPLE_PAGINATION_COUNT
        ) {
          return null
        }
        return createPeopleCacheKey({ pageIndex })
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        return getPeople({
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

  const people = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= PEOPLE_PAGINATION_COUNT

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
