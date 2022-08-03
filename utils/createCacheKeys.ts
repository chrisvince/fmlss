import type { FeedSortMode } from '../types'

const createHashtagPostsCacheKey = (
  hashtag: string,
  showType: 'post' | 'reply' | 'both',
  sortMode: FeedSortMode = 'latest',
  pageIndex: number | null = 0
) => `hashtag/${hashtag}/posts/${showType}/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const createPostAuthorCacheKey = (slug: string) => `post/${slug}/author`

const createPostCacheKey = (slug: string) => `post/${slug}`

const createPostFeedCacheKey = (
  sortMode: FeedSortMode,
  pageIndex: number | null = 0
) => `post/feed/${sortMode}${pageIndex ===  null ? '' : `-${pageIndex}`}`

const getPageIndexFromCacheKey =
  (cacheKey: string) => cacheKey.split('-').at(-1) as string

const createPostRepliesCacheKey = (
  slug: string,
  pageIndex: number | null = 0,
  viewMode: 'start' | 'end' = 'start'
) => `post/${slug}/replies${viewMode === 'end' ? '-reverse' : ''}${pageIndex === null ? '' : `-${pageIndex}`}`

const createPostLikeCacheKey = (postId: string, uid: string) =>
  `post/${postId}/like/${uid}`

const createUserLikesCacheKey = (uid: string, pageIndex: number | null = 0) =>
  `post/likes/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

const createUserPostsCacheKey = (uid: string, pageIndex: number | null = 0) =>
  `post/authored/post/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

const createUserRepliesCacheKey = (uid: string, pageIndex: number | null = 0) =>
  `post/authored/reply/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

const createHashtagsCacheKey = (
  sortMode: string,
  pageIndex: number | null = 0
) => `hashtags/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const createCategoriesCacheKey = (
  sortMode: string,
  pageIndex: number | null = 0
) => `categories/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const createCategoryPostsCacheKey = (
  slug: string,
  sortMode: FeedSortMode = 'latest',
  pageIndex: number | null = 0
) => `category/${slug}/posts/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const createCategoryCacheKey = (slug: string) => `category/${slug}`

const createMiniHashtagsCacheKey = () => 'hashtags/mini'
const createMiniCategoriesCacheKey = () => 'categories/mini'

const createUserCacheKey = (uid: string | null) => uid ? `user/${uid}` : null

export {
  createCategoriesCacheKey,
  createCategoryCacheKey,
  createCategoryPostsCacheKey,
  createHashtagPostsCacheKey,
  createHashtagsCacheKey,
  createMiniCategoriesCacheKey,
  createMiniHashtagsCacheKey,
  createPostAuthorCacheKey,
  createPostCacheKey,
  createPostFeedCacheKey,
  createPostLikeCacheKey,
  createPostRepliesCacheKey,
  createUserCacheKey,
  createUserLikesCacheKey,
  createUserPostsCacheKey,
  createUserRepliesCacheKey,
  getPageIndexFromCacheKey,
}
