import constants from '../../../constants'
import {
  createSidebarTopicsCacheKey,
  createSidebarHashtagsCacheKey,
  createSidebarPeopleCacheKey,
} from '../../createCacheKeys'
import getTopics from '../topics/getTopics'
import getHashtags from '../hashtags/getHashtags'
import firebase from 'firebase/app'
import {
  HashtagsSortMode,
  PeopleSortMode,
  TopicsSortMode,
} from '../../../types'
import getPeople from '../people/getPeople'

const { SIDEBAR_LIST_CACHE_TIME, SIDEBAR_LIST_COUNT } = constants

export enum SidebarResourceKey {
  Hashtags = 'hashtags',
  People = 'people',
  Topics = 'topics',
}

const fetchSidebarFallbackData = async ({
  db,
  exclude = [],
}: {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  exclude?: SidebarResourceKey[]
}) => {
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
      ? getHashtags({
          cacheKey: hashtagsCacheKey,
          cacheTime: SIDEBAR_LIST_CACHE_TIME,
          db,
          limit: SIDEBAR_LIST_COUNT,
          sortMode: HashtagsSortMode.Popular,
        })
      : null

  const getSidebarTopics = () =>
    sidebarTopicsCacheKey
      ? getTopics({
          cacheKey: sidebarTopicsCacheKey,
          cacheTime: SIDEBAR_LIST_CACHE_TIME,
          db,
          limit: SIDEBAR_LIST_COUNT,
          sortMode: TopicsSortMode.Popular,
        })
      : null

  const getSidebarPeople = () =>
    sidebarPeopleCacheKey
      ? getPeople({
          cacheKey: sidebarPeopleCacheKey,
          cacheTime: SIDEBAR_LIST_CACHE_TIME,
          db,
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

export default fetchSidebarFallbackData
