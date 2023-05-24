import type { FeedSortMode } from '../types'

const createHashtagPostsCacheKey = (
  slug: string,
  showType: 'post' | 'reply' | 'both',
  sortMode: FeedSortMode = 'latest',
  pageIndex: number | null = 0
) =>
  `hashtag/${slug}/posts/${showType}/${sortMode}${
    pageIndex === null ? '' : `-${pageIndex}`
  }`

const createPostAuthorCacheKey = (slug: string) => `post/${slug}/author`

const createPostCacheKey = (slug: string) => `post/${slug}`

const createPostFeedCacheKey = (
  sortMode: FeedSortMode,
  { pageIndex = 0 }: { pageIndex?: number | null } = {}
) => `post/feed/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const getPageIndexFromCacheKey = (cacheKey: string) =>
  cacheKey.split('-').at(-1) as string

const createPostRepliesCacheKey = (
  slug: string,
  {
    pageIndex = 0,
    viewMode = 'start',
  }: {
    pageIndex?: number | null
    viewMode?: 'start' | 'end'
  } = {}
) =>
  `post/${slug}/replies${viewMode === 'end' ? '-reverse' : ''}${
    pageIndex === null ? '' : `-${pageIndex}`
  }`

const createPostLikeCacheKey = (postId: string, uid: string) =>
  `post/${postId}/like/${uid}`

const createUserLikesCacheKey = (
  uid: string,
  { pageIndex = 0 }: { pageIndex?: number | null } = {}
) => `post/likes/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

const createUserPostsCacheKey = (
  uid: string,
  { pageIndex = 0 }: { pageIndex?: number | null } = {}
) => `post/authored/post/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

const createUserRepliesCacheKey = (
  uid: string,
  { pageIndex = 0 }: { pageIndex?: number | null } = {}
) => `post/authored/reply/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

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
  {
    sortMode = 'latest',
    pageIndex = 0,
  }: { sortMode?: FeedSortMode; pageIndex?: number | null } = {}
) =>
  `category/${slug}/posts/${sortMode}${
    pageIndex === null ? '' : `-${pageIndex}`
  }`

const createCategoryCacheKey = (slug: string) => `category/${slug}`

const createSidebarHashtagsCacheKey = () => 'sidebar/hashtags'
const createSidebarCategoriesCacheKey = () => 'sidebar/categories'

const createUserCacheKey = (uid: string | null) => (uid ? `user/${uid}` : null)

const createCategoriesStartsWithCacheKey = (searchString: string) =>
  `categories/search/${searchString}`

const createHasUsernameCacheKey = (uid: string) => `user/${uid}/has-username`

export {
  createCategoriesCacheKey,
  createCategoriesStartsWithCacheKey,
  createCategoryCacheKey,
  createCategoryPostsCacheKey,
  createHashtagPostsCacheKey,
  createHashtagsCacheKey,
  createHasUsernameCacheKey,
  createSidebarCategoriesCacheKey,
  createSidebarHashtagsCacheKey,
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
