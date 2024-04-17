import constants from '../../../constants'
import {
  createSidebarTopicsCacheKey,
  createSidebarHashtagsCacheKey,
  createSidebarPeopleCacheKey,
} from '../../createCacheKeys'
import {
  HashtagsSortMode,
  PeopleSortMode,
  TopicsSortMode,
} from '../../../types'
import isServer from '../../isServer'
import getHashtagsServer from '../hashtags/getHashtagsServer'
import getTopicsServer from '../topics/getTopicsServer'
import getPeopleServer from '../people/getPeopleServer'

const { SIDEBAR_LIST_CACHE_TIME, SIDEBAR_LIST_COUNT } = constants

export enum SidebarResourceKey {
  Hashtags = 'hashtags',
  People = 'people',
  Topics = 'topics',
}

const getSidebarDataServer = async ({
  exclude = [],
}: {
  exclude?: SidebarResourceKey[]
} = {}) => {
  if (!isServer) {
    throw new Error('getPostFeedServer must be called on the server')
  }

  const hashtagsCacheKey = !exclude.includes(SidebarResourceKey.Hashtags)
    ? createSidebarHashtagsCacheKey()
    : null

  const sidebarTopicsCacheKey = !exclude.includes(SidebarResourceKey.Topics)
    ? createSidebarTopicsCacheKey()
    : null

  const sidebarPeopleCacheKey = !exclude.includes(SidebarResourceKey.People)
    ? createSidebarPeopleCacheKey()
    : null

  const getSidebarHashtags = () =>
    hashtagsCacheKey
      ? getHashtagsServer({
          cacheKey: hashtagsCacheKey,
          cacheTime: SIDEBAR_LIST_CACHE_TIME,
          limit: SIDEBAR_LIST_COUNT,
          sortMode: HashtagsSortMode.Popular,
        })
      : null

  const getSidebarTopics = () =>
    sidebarTopicsCacheKey
      ? getTopicsServer({
          cacheKey: sidebarTopicsCacheKey,
          cacheTime: SIDEBAR_LIST_CACHE_TIME,
          limit: SIDEBAR_LIST_COUNT,
          sortMode: TopicsSortMode.Popular,
        })
      : null

  const getSidebarPeople = () =>
    sidebarPeopleCacheKey
      ? getPeopleServer({
          cacheKey: sidebarPeopleCacheKey,
          cacheTime: SIDEBAR_LIST_CACHE_TIME,
          limit: SIDEBAR_LIST_COUNT,
          sortMode: PeopleSortMode.Popular,
        })
      : null

  const [sidebarHashtags, sidebarTopics, sidebarPeople] = await Promise.all([
    hashtagsCacheKey ? getSidebarHashtags() : null,
    sidebarTopicsCacheKey ? getSidebarTopics() : null,
    sidebarPeopleCacheKey ? getSidebarPeople() : null,
  ])

  return {
    ...(hashtagsCacheKey ? { [hashtagsCacheKey]: sidebarHashtags } : {}),
    ...(sidebarPeopleCacheKey
      ? { [sidebarPeopleCacheKey]: sidebarPeople }
      : {}),
    ...(sidebarTopicsCacheKey
      ? { [sidebarTopicsCacheKey]: sidebarTopics }
      : {}),
  }
}

export default getSidebarDataServer
