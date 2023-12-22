import constants from '../constants'
import {
  FeedSortMode,
  HashtagSortMode,
  TopicSortMode,
  TopicsSortMode,
} from '../types'
import { HashtagShowType } from './data/posts/getHashtagPosts'

const { POST_PAGINATION_COUNT } = constants

const createHashtagPostsCacheKey = (
  slug: string,
  showType: HashtagShowType = HashtagShowType.Post,
  sortMode: HashtagSortMode = HashtagSortMode.Latest,
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

const createTopicsCacheKey = ({
  limit = POST_PAGINATION_COUNT,
  pageIndex = 0,
  parentTopicRef,
  sortMode,
}: {
  limit?: number
  pageIndex?: number | null
  parentTopicRef?: string
  sortMode: TopicsSortMode
}) =>
  `topics/${
    parentTopicRef ? `${parentTopicRef}/` : ''
  }${sortMode}/limit=${limit}-${pageIndex}`

const createTopicPostsCacheKey = (
  slug: string,
  {
    sortMode = TopicSortMode.Latest,
    pageIndex = 0,
  }: { sortMode?: TopicSortMode; pageIndex?: number | null } = {}
) =>
  `topic/${slug}/posts/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const createTopicCacheKey = (slug: string) => `topic/${slug}`

const createSidebarHashtagsCacheKey = () => 'sidebar/hashtags'
const createSidebarTopicsCacheKey = () => 'sidebar/topics'
const createUserCacheKey = (uid: string) => `user/${uid}`

const createTopicsStartsWithCacheKey = (searchString: string) =>
  `topics/search/${searchString}`

const createNotificationCacheKey = (
  uid: string,
  { pageIndex = 0, limit }: { pageIndex: number; limit: number }
) => `notifications/${uid}/limit=${limit}-${pageIndex}`

const createHasUnreadNotificationsCacheKey = (uid: string) =>
  `has-unread-notifications/${uid}`

export {
  createTopicsCacheKey,
  createTopicsStartsWithCacheKey,
  createTopicCacheKey,
  createTopicPostsCacheKey,
  createHashtagPostsCacheKey,
  createHashtagsCacheKey,
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
