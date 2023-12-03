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

const createUserIsWatchingCacheKey = (postId: string, uid: string) =>
  `post/${postId}/watching/${uid}`

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

const createTopicsCacheKey = (sortMode: string, pageIndex: number | null = 0) =>
  `topics/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const createTopicPostsCacheKey = (
  slug: string,
  {
    sortMode = 'latest',
    pageIndex = 0,
  }: { sortMode?: FeedSortMode; pageIndex?: number | null } = {}
) =>
  `topic/${slug}/posts/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const createTopicCacheKey = (slug: string) => `topic/${slug}`

const createSidebarHashtagsCacheKey = () => 'sidebar/hashtags'
const createSidebarTopicsCacheKey = () => 'sidebar/topics'

const createUserCacheKey = (uid: string | null) => (uid ? `user/${uid}` : null)

const createTopicsStartsWithCacheKey = (searchString: string) =>
  `topics/search/${searchString}`

const createHasUsernameCacheKey = (uid: string) => `user/${uid}/has-username`

const createNotificationCacheKey = (
  uid: string,
  { pageIndex = 0, limit }: { pageIndex: number; limit?: number }
) =>
  `notifications/${uid}?pageIndex=${pageIndex}${limit ? `&limit=${limit}` : ''}`

const createHasUnreadNotificationsCacheKey = (uid: string) =>
  `has-unread-notifications/${uid}`

export {
  createTopicsCacheKey,
  createTopicsStartsWithCacheKey,
  createTopicCacheKey,
  createTopicPostsCacheKey,
  createHashtagPostsCacheKey,
  createHashtagsCacheKey,
  createHasUsernameCacheKey,
  createPostAuthorCacheKey,
  createPostCacheKey,
  createPostFeedCacheKey,
  createPostLikeCacheKey,
  createPostRepliesCacheKey,
  createUserIsWatchingCacheKey,
  createSidebarTopicsCacheKey,
  createSidebarHashtagsCacheKey,
  createUserCacheKey,
  createUserLikesCacheKey,
  createUserPostsCacheKey,
  createUserRepliesCacheKey,
  getPageIndexFromCacheKey,
  createNotificationCacheKey,
  createHasUnreadNotificationsCacheKey,
}
