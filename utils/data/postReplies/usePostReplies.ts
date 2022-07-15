import { useEffect, useState } from 'react'
import { useAuthUser } from 'next-firebase-auth'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'
import { KeyedMutator, useSWRConfig } from 'swr'
import { reverse } from 'ramda'

import { FirebaseDoc, Post } from '../../../types'
import {
  createPostRepliesCacheKey,
  getPageIndexFromCacheKey,
} from '../../createCacheKeys'
import usePost from '../post/usePost'
import getPostReplies from './getPostReplies'
import getLastDocOfLastPage from '../../getLastDocOfLastPage'
import constants from '../../../constants'

const { PAGINATION_COUNT } = constants

const DEFAULT_SWR_CONFIG: SWRInfiniteConfiguration = {
  revalidateOnMount: true,
  revalidateOnFocus: false,
}

type UsePostReplies = (
  slug: string,
  options?: {
    viewMode?: 'start' | 'end'
    swrConfig?: SWRInfiniteConfiguration
  },
) => {
  error: any
  isLoading: boolean
  isValidating: boolean
  loadMore: () => Promise<Post[]>
  moreToLoad: boolean
  mutate: KeyedMutator<Post[]>
  replies: Post[]
}

const usePostReplies: UsePostReplies = (
  slug,
  {
    viewMode = 'start',
    swrConfig = {},
  } = {},
) => {
  const [pageStartAfterTrace, setPageStartAfterTrace] = useState<{
    [key: string]: FirebaseDoc
  }>({})

  const { fallback } = useSWRConfig()
  const fallbackData = fallback[createPostRepliesCacheKey(slug, 0, viewMode)]
  const { id: uid } = useAuthUser()
  const { post, isValidating: postIsValidating } = usePost(slug)

  const {
    data,
    error,
    isValidating: repliesAreValidating,
    mutate: mutateOriginal,
    size,
    setSize,
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && previousPageData.length < PAGINATION_COUNT) {
        return null
      }
      return createPostRepliesCacheKey(slug, index, viewMode)
    },
    key => {
      const pageIndex = getPageIndexFromCacheKey(key)
      return getPostReplies(post.data.reference, slug, {
        uid,
        startAfter: pageStartAfterTrace[pageIndex],
        viewMode,
      })
    },
    {
      fallbackData,
      ...DEFAULT_SWR_CONFIG,
      ...swrConfig,
    }
  )

  useEffect(() => {
    const lastPageLastDoc = getLastDocOfLastPage(data)
    if (!lastPageLastDoc) return
    setPageStartAfterTrace(currentState => ({
      ...currentState,
      [size]: lastPageLastDoc,
    }))
  }, [data, size])

  useEffect(() => {
    setPageStartAfterTrace({})
  }, [viewMode])

  const loadMore = async () => {
    const data = await setSize(size + 1)
    return data?.flat() ?? []
  }

  const mutate = async () => {
    const data = await mutateOriginal()
    return data?.flat() ?? []
  }

  const flattenedData = data?.flat() ?? []
  const replies = viewMode === 'end' ? reverse(flattenedData) : flattenedData
  const isLoading = !error && !data
  const isValidating = repliesAreValidating || postIsValidating

  const moreToLoad = !isValidating && (
    post.data.postsCount === undefined || replies.length < post.data.postsCount
  )

  return {
    error,
    isLoading,
    isValidating,
    loadMore,
    moreToLoad,
    mutate,
    replies,
  }
}

export default usePostReplies
