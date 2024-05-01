import constants from '../constants'
import {
  FeedSortMode,
  Hashtag,
  HashtagSortMode,
  HashtagsSortMode,
  Person,
  Post,
  PostTypeQuery,
  Topic,
  TopicSortMode,
  TopicsSortMode,
} from '../types'
import { PeopleSortMode } from '../types/PeopleSortMode'
import { PersonPostsSortMode } from '../types/PersonPostsSortMode'

const {
  HASHTAGS_PAGINATION_COUNT,
  NOTIFICATION_PAGINATION_COUNT,
  PEOPLE_PAGINATION_COUNT,
  POST_PAGINATION_COUNT,
  POST_REPLIES_PAGINATION_COUNT,
  TOPICS_PAGINATION_COUNT,
} = constants

const createHashtagPostsCacheKey = (
  slug: string,
  showType: PostTypeQuery = PostTypeQuery.Post,
  sortMode: HashtagSortMode = HashtagSortMode.Latest,
  pageIndex: number | null = 0
) =>
  `hashtag/${slug}/posts/${showType}/${sortMode}${
    pageIndex === null ? '' : `-${pageIndex}`
  }`

const createHashtagPostsSWRGetKey =
  ({
    showType,
    slug,
    sortMode,
    uid,
  }: {
    showType: PostTypeQuery
    slug: string
    sortMode: HashtagSortMode
    uid: string | null
  }) =>
  (_: number, previousPageData: Post[]) => {
    if (!previousPageData) {
      return {
        key: 'hashtag-posts',
        showType,
        slug,
        sortMode,
        startAfter: null,
        uid,
      }
    }

    if (previousPageData.length < POST_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'hashtag-posts',
      showType,
      slug,
      sortMode,
      startAfter: previousPageData.at(-1),
      uid,
    }
  }

const createPostAuthorCacheKey = (slug: string) => `post/${slug}/author`

const createPostCacheKey = (slug: string) => `post/${slug}`

const createPostFeedCacheKeyServer = ({
  sortMode = FeedSortMode.Latest,
}: {
  sortMode: FeedSortMode
}) => `post/feed?sortMode=${sortMode}`

const createPostFeedSWRGetKey =
  ({ uid, sortMode }: { uid: string | null; sortMode: FeedSortMode }) =>
  (_: number, previousPageData: Post[]) => {
    if (!uid) return null

    if (!previousPageData) {
      return {
        key: 'post/feed',
        sortMode,
        startAfter: null,
        uid,
      }
    }

    if (previousPageData.length < POST_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'post/feed',
      sortMode,
      startAfter: previousPageData.at(-1),
      uid,
    }
  }

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

const createPostRepliesSWRGetKey =
  ({
    slug,
    uid,
  }: {
    slug: string | undefined
    uid: string | undefined | null
  }) =>
  (_: number, previousPageData: Post[]) => {
    if (!slug) return null

    if (!previousPageData) {
      return {
        key: 'post-replies',
        slug,
        startAfter: null,
        uid,
      }
    }

    if (previousPageData.length < POST_REPLIES_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'post-replies',
      slug,
      startAfter: previousPageData.at(-1),
      uid,
    }
  }

const createPostLikeCacheKey = (postId: string, uid: string) =>
  `post/${postId}/like/${uid}`

const createUserIsWatchingCacheKey = (postId: string, uid: string) =>
  `post/${postId}/watching/${uid}`

const createUserLikesCacheKey = (
  uid: string,
  { pageIndex = 0 }: { pageIndex?: number | null } = {}
) => `post/likes/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

const createUserLikesSWRGetKey =
  ({ uid }: { uid: string | null }) =>
  (_: number, previousPageData: Post[]) => {
    if (!uid) return null

    if (!previousPageData) {
      return {
        key: 'user-likes',
        startAfter: null,
        uid,
      }
    }

    if (previousPageData.length < POST_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'user-likes',
      startAfter: previousPageData.at(-1),
      uid,
    }
  }

const createUserPostsCacheKey = (
  uid: string,
  { pageIndex = 0 }: { pageIndex?: number | null } = {}
) => `post/authored/post/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

const createUserPostsSWRGetKey =
  ({
    type = PostTypeQuery.Both,
    uid,
  }: {
    type: PostTypeQuery | undefined
    uid: string | null
  }) =>
  (_: number, previousPageData: Post[]) => {
    if (!uid) return null

    if (!previousPageData) {
      return {
        key: 'user-posts',
        startAfter: null,
        type,
        uid,
      }
    }

    if (previousPageData.length < POST_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'user-posts',
      startAfter: previousPageData.at(-1),
      type,
      uid,
    }
  }

const createUserRepliesCacheKey = (
  uid: string,
  { pageIndex = 0 }: { pageIndex?: number | null } = {}
) => `post/authored/reply/${uid}${pageIndex === null ? '' : `-${pageIndex}`}`

const createHashtagsCacheKeyServer = (sortMode: HashtagsSortMode) =>
  `hashtags/${sortMode}`

const createHashtagSWRGetKey =
  ({ sortMode }: { sortMode: HashtagsSortMode }) =>
  (_: number, previousPageData: Hashtag[]) => {
    if (!previousPageData) {
      return {
        key: 'hashtags',
        sortMode,
        startAfter: null,
      }
    }

    if (previousPageData.length < HASHTAGS_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'hashtags',
      sortMode,
      startAfter: previousPageData.at(-1),
    }
  }

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

const createTopicsSWRGetKey =
  ({
    limit = POST_PAGINATION_COUNT,
    parentTopicRef,
    skip = false,
    sortMode,
  }: {
    limit?: number
    parentTopicRef?: string
    skip?: boolean
    sortMode: TopicsSortMode
  }) =>
  (_: number, previousPageData: Topic[]) => {
    if (!previousPageData) {
      return {
        key: 'topics',
        limit,
        parentTopicRef,
        skip,
        sortMode,
        startAfter: null,
      }
    }

    if (previousPageData.length < TOPICS_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'topics',
      limit,
      parentTopicRef,
      skip,
      sortMode,
      startAfter: previousPageData.at(-1),
    }
  }

const createTopicPostsCacheKey = (
  slug: string,
  {
    sortMode = TopicSortMode.Latest,
    pageIndex = 0,
  }: { sortMode?: TopicSortMode; pageIndex?: number | null } = {}
) =>
  `topic/${slug}/posts/${sortMode}${pageIndex === null ? '' : `-${pageIndex}`}`

const createTopicPostsSWRGetKey =
  ({
    path,
    sortMode,
    uid,
  }: {
    path: string
    sortMode: TopicSortMode
    uid: string | null
  }) =>
  (_: number, previousPageData: Post[]) => {
    if (!previousPageData) {
      return {
        key: 'topic-posts',
        path,
        sortMode,
        startAfter: null,
        uid,
      }
    }

    if (previousPageData.length < POST_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'topic-posts',
      path,
      sortMode,
      startAfter: previousPageData.at(-1),
      uid,
    }
  }

const createTopicCacheKey = (slug: string) => `topic/${slug}`
const createSidebarHashtagsCacheKey = () => 'sidebar/hashtags'
const createSidebarPeopleCacheKey = () => 'sidebar/people'
const createSidebarTopicsCacheKey = () => 'sidebar/topics'
const createUserCacheKey = (uid: string) => `user/${uid}`

const createTopicsStartsWithCacheKey = (searchString: string) =>
  `topics/search/${searchString}`

const createNotificationCacheKey = (
  uid: string,
  { pageIndex = 0, limit }: { pageIndex: number; limit: number }
) => `notifications/${uid}/limit=${limit}-${pageIndex}`

const createNotificationsSWRGetKey =
  ({
    limit = NOTIFICATION_PAGINATION_COUNT,
    skip = false,
    uid,
  }: {
    limit?: number
    skip?: boolean
    uid: string | null
  }) =>
  (_: number, previousPageData: Notification[]) => {
    if (!uid || skip) return null

    if (!previousPageData) {
      return {
        key: 'notifications',
        limit,
        startAfter: null,
        uid,
      }
    }

    if (previousPageData.length < NOTIFICATION_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'notifications',
      limit,
      startAfter: previousPageData.at(-1),
      uid,
    }
  }

const createHasUnreadNotificationsCacheKey = (uid: string) =>
  `has-unread-notifications/${uid}`

const createPostReactionCacheKey = (slug: string, uid: string) =>
  `post/${slug}/reaction/${uid}`

const createPeopleCacheKey = ({
  pageIndex = 0,
  sortMode = PeopleSortMode.Popular,
}: { pageIndex?: number; sortMode?: PeopleSortMode } = {}) =>
  `people/${sortMode}-${pageIndex}`

const createPeopleSWRGetKey =
  ({ sortMode }: { sortMode: PeopleSortMode }) =>
  (_: number, previousPageData: Person[]) => {
    if (!previousPageData) {
      return {
        key: 'people',
        sortMode,
        startAfter: null,
      }
    }

    if (previousPageData.length < PEOPLE_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'people',
      sortMode,
      startAfter: previousPageData.at(-1),
    }
  }

const createPersonCacheKey = (slug: string) => `person/${slug}`

const createPersonPostsCacheKey = (
  slug: string,
  {
    pageIndex = 0,
    sortMode = PersonPostsSortMode.Popular,
  }: { pageIndex?: number; sortMode?: PersonPostsSortMode } = {}
) => `person/${slug}/${sortMode}/posts-${pageIndex}`

const createPersonPostsSWRGetKey =
  ({
    slug,
    sortMode,
    uid,
  }: {
    slug: string
    sortMode: PersonPostsSortMode
    uid: string | null
  }) =>
  (_: number, previousPageData: Post[]) => {
    if (!previousPageData) {
      return {
        key: 'person-posts',
        slug,
        sortMode,
        startAfter: null,
        uid,
      }
    }

    if (previousPageData.length < POST_PAGINATION_COUNT) {
      return null
    }

    return {
      key: 'person-posts',
      slug,
      sortMode,
      startAfter: previousPageData.at(-1),
      uid,
    }
  }

const createPeopleSearchCacheKey = (searchString: string) =>
  `people/search/${searchString}`

const createTwitterAttachmentCacheKey = (url: string) =>
  `twitter-attachment/${url}`

const createYouTubeAttachmentCacheKey = (url: string) =>
  `youtube-attachment/${url}`

export {
  createHashtagPostsCacheKey,
  createHashtagPostsSWRGetKey,
  createHashtagsCacheKeyServer,
  createHashtagSWRGetKey,
  createHasUnreadNotificationsCacheKey,
  createNotificationCacheKey,
  createNotificationsSWRGetKey,
  createPeopleCacheKey,
  createPeopleSearchCacheKey,
  createPeopleSWRGetKey,
  createPersonCacheKey,
  createPersonPostsCacheKey,
  createPersonPostsSWRGetKey,
  createPostAuthorCacheKey,
  createPostCacheKey,
  createPostFeedCacheKeyServer,
  createPostFeedSWRGetKey,
  createPostLikeCacheKey,
  createPostReactionCacheKey,
  createPostRepliesCacheKey,
  createPostRepliesSWRGetKey,
  createSidebarHashtagsCacheKey,
  createSidebarPeopleCacheKey,
  createSidebarTopicsCacheKey,
  createTopicCacheKey,
  createTopicPostsCacheKey,
  createTopicPostsSWRGetKey,
  createTopicsCacheKey,
  createTopicsStartsWithCacheKey,
  createTopicsSWRGetKey,
  createTwitterAttachmentCacheKey,
  createUserCacheKey,
  createUserIsWatchingCacheKey,
  createUserLikesCacheKey,
  createUserLikesSWRGetKey,
  createUserPostsCacheKey,
  createUserPostsSWRGetKey,
  createUserRepliesCacheKey,
  createYouTubeAttachmentCacheKey,
}
