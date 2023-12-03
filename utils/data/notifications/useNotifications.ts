import { useAuthUser } from 'next-firebase-auth'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import {
  createNotificationCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import constants from '../../../constants'
import getNotifications from './getNotifications'
import { FirebaseDoc, Notification } from '../../../types'
import { useEffect, useMemo, useState } from 'react'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'

const { POST_PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  initialSize: 1,
  parallel: true,
  revalidateAll: true,
  revalidateFirstPage: true,
  revalidateOnFocus: true,
  revalidateOnMount: true,
}

type UseNotifications = (options?: {
  limit?: number
  markRead?: boolean
  skip?: boolean
  swrConfig?: SWRInfiniteConfiguration
}) => {
  error: unknown
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Notification[]>
  moreToLoad: boolean
  notifications: Notification[]
}

const useNotifications: UseNotifications = ({
  limit,
  markRead = true,
  skip,
  swrConfig,
} = {}) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { id: uid } = useAuthUser()
  const resolvedLimit = limit ?? POST_PAGINATION_COUNT

  const { data, error, isLoading, isValidating, mutate, setSize, size } =
    useSWRInfinite(
      (pageIndex, previousPageData) => {
        if (skip) return null

        if (
          previousPageData &&
          previousPageData.length < POST_PAGINATION_COUNT
        ) {
          return null
        }

        return createNotificationCacheKey(uid!, {
          pageIndex,
          limit: resolvedLimit,
        })
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        return getNotifications(uid!, {
          startAfter: pageStartAfterTrace[pageIndex],
          limit: resolvedLimit,
        })
      },
      {
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

  const notifications = useMemo(() => data?.flat() ?? [], [data])

  const lastPageLength = data?.at?.(-1)?.length

  const moreToLoad =
    lastPageLength === undefined || lastPageLength >= POST_PAGINATION_COUNT

  useEffect(() => {
    if (!markRead) return
    const unreadNotifications = notifications.filter(({ data }) => !data.readAt)
    if (!unreadNotifications.length) return

    unreadNotifications.forEach(({ doc }) => {
      doc.ref.update({ readAt: new Date() })
    })
  }, [markRead, notifications])

  return {
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
    mutate,
    notifications,
  }
}

export default useNotifications
