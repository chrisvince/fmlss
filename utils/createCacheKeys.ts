import type { FeedSortMode } from '../types'

const createHashtagPostsCacheKey = (
  hashtag: string,
  showType: 'post' | 'reply' | 'both',
  sortMode: FeedSortMode = 'latest',
  pageIndex: number = 0
) => `hashtag/${hashtag}/${showType}/${sortMode}-${pageIndex}`

const createPostAuthorCacheKey = (slug: string) => `post/${slug}/author`

const createPostCacheKey = (slug: string) => `post/${slug}`

const createPostFeedCacheKey = (
  sortMode: FeedSortMode,
  pageIndex: number = 0
) => `post/feed/${sortMode}-${pageIndex}`

const getPageIndexFromCacheKey =
  (cacheKey: string) => cacheKey.split('-').at(-1) as string

const createPostRepliesCacheKey = (
  slug: string,
  pageIndex: number = 0,
  viewMode: 'start' | 'end' = 'start'
) => `post/${slug}/replies${viewMode === 'end' ? '-reverse' : ''}-${pageIndex}`

const createPostLikeCacheKey = (postId: string, uid: string) =>
  `post/${postId}/like/${uid}`

const createUserLikesCacheKey = (uid: string, pageIndex: number = 0) =>
  `post/likes/${uid}-${pageIndex}`

const createUserPostsCacheKey = (uid: string, pageIndex: number = 0) =>
  `post/authored/post/${uid}-${pageIndex}`

const createUserRepliesCacheKey = (uid: string, pageIndex: number = 0) =>
  `post/authored/reply/${uid}-${pageIndex}`

export {
  createHashtagPostsCacheKey,
  createPostAuthorCacheKey,
  createPostCacheKey,
  createPostFeedCacheKey,
  createPostLikeCacheKey,
  createPostRepliesCacheKey,
  createUserLikesCacheKey,
  createUserPostsCacheKey,
  createUserRepliesCacheKey,
  getPageIndexFromCacheKey,
}
