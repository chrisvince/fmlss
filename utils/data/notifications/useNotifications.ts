import { useUser } from 'next-firebase-auth'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import {
  createNotificationCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import constants from '../../../constants'
import getNotifications from './getNotifications'
import { FirebaseDoc, Notification } from '../../../types'
import { useEffect, useMemo, useRef } from 'react'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import checkPossibleMoreToLoad from '../../checkPossibleMoreToLoad'
import { useSWRConfig } from 'swr'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'

const { NOTIFICATION_PAGINATION_COUNT, NOTIFICATIONS_COLLECTION } = constants

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
  limit = NOTIFICATION_PAGINATION_COUNT,
  markRead = true,
  skip,
  swrConfig,
} = {}) => {
  const db = getFirestore()
  const pageStartAfterTraceRef = useRef<{ [key: string]: FirebaseDoc }>({})
  const { id: uid } = useUser()

  const { fallback } = useSWRConfig()

  const fallbackData =
    fallback[
      createNotificationCacheKey(uid!, {
        pageIndex: 0,
        limit,
      })
    ]

  const { data, error, isLoading, isValidating, mutate, setSize, size } =
    useSWRInfinite(
      (pageIndex, previousPageData) => {
        if (
          (previousPageData && previousPageData.length < limit) ||
          skip ||
          !uid
        ) {
          return null
        }

        return createNotificationCacheKey(uid, {
          pageIndex,
          limit,
        })
      },
      key => {
        const pageIndex = getPageIndexFromCacheKey(key)
        return getNotifications(uid!, {
          startAfter: pageStartAfterTraceRef.current[pageIndex],
          limit,
        })
      },
      {
        fallbackData,
        ...DEFAULT_SWR_CONFIG,
        ...swrConfig,
      }
    )

  console.log('data', data)
  const lastPageLastDoc = getLastDocOfLastPage(data)
  const moreToLoad = checkPossibleMoreToLoad(data, limit)
  const notifications = useMemo(() => data?.flat() ?? [], [data])

  const loadMore = async () => {
    if (!moreToLoad) return data?.flat() ?? []
    const newData = await setSize(size + 1)
    return newData?.flat() ?? []
  }

  useEffect(() => {
    if (!markRead) return
    const unreadNotifications = notifications.filter(({ data }) => !data.readAt)
    if (!unreadNotifications.length) return

    unreadNotifications.forEach(({ data }) => {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, data.id)
      updateDoc(docRef, { readAt: new Date() })
    })
  }, [markRead, notifications])

  useEffect(() => {
    if (!lastPageLastDoc) return

    pageStartAfterTraceRef.current = {
      ...pageStartAfterTraceRef.current,
      [size]: lastPageLastDoc,
    }
  }, [lastPageLastDoc, size])

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
