import { useAuthUser } from 'next-firebase-auth'
import { useEffect, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { KeyedMutator, useSWRConfig } from 'swr'

import { FirebaseDoc, Post } from '../../../types'
import {
  createUserLikesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import getUserLikes from './getUserLikes'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

type UseUserLikes = () => {
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  mutate: KeyedMutator<Post[]>
  posts: Post[]
}

const useUserLikes: UseUserLikes = () => {
  const [pageStartAfterTrace, setPageStartAfterTrace] =
    useState<{[key: string]: FirebaseDoc}>({})

  const { id: uid } = useAuthUser()
  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createUserLikesCacheKey(uid!)]

  if (!uid) {
    console.error('uid must be set.')
  }

  const {
    data,
    error,
    isValidating,
    mutate: mutateOriginal,
    size,
    setSize,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && previousPageData.length < PAGINATION_COUNT) {
        return null
      }
      return createUserLikesCacheKey(uid!, index)
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getUserLikes(uid!, {
        startAfter: pageStartAfterTrace[pageIndex],
      })
    },
    {
      fallbackData,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateAll: false
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

  const mutate = async () => {
    const data = await mutateOriginal()
    return data?.flat() ?? []
  }

  const posts = data?.flat() ?? []
  const lastPageLength = data?.at?.(-1)?.length
  const isLoading = !error && !data

  const moreToLoad = !isValidating && (
    lastPageLength === undefined || lastPageLength >= PAGINATION_COUNT
  )

  return {
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
    mutate,
    posts,
  }
}

export default useUserLikes
