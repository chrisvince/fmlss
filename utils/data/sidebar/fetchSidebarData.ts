import constants from '../../../constants'
import {
  createSidebarTopicsCacheKey,
  createSidebarHashtagsCacheKey,
} from '../../createCacheKeys'
import getTopics from '../topics/getTopics'
import getHashtags from '../hashtags/getHashtags'
import firebase from 'firebase/app'
import { HashtagsSortMode, TopicsSortMode } from '../../../types'

const { TOPICS_ENABLED, SIDEBAR_LIST_CACHE_TIME, SIDEBAR_LIST_COUNT } =
  constants

export enum SidebarResourceKey {
  HASHTAGS = 'hashtags',
  TOPICS = 'topics',
}

const fetchSidebarData = async ({
  db,
  exclude = [],
}: {
  db?: firebase.firestore.Firestore | FirebaseFirestore.Firestore
  exclude?: (SidebarResourceKey.HASHTAGS | SidebarResourceKey.TOPICS)[]
}) => {
  const sidebarHashtagsCacheKey = createSidebarHashtagsCacheKey()
  const sidebarTopicsCacheKey = createSidebarTopicsCacheKey()

  const getSidebarHashtags = () =>
    getHashtags({
      cacheKey: sidebarHashtagsCacheKey,
      cacheTime: SIDEBAR_LIST_CACHE_TIME,
      db,
      limit: SIDEBAR_LIST_COUNT,
      sortMode: HashtagsSortMode.Popular,
    })

  const getSidebarTopics = () =>
    getTopics({
      cacheKey: sidebarTopicsCacheKey,
      cacheTime: SIDEBAR_LIST_CACHE_TIME,
      db,
      limit: SIDEBAR_LIST_COUNT,
      sortMode: TopicsSortMode.Popular,
    })

  const [sidebarHashtags, sidebarTopics] = await Promise.all([
    exclude.includes(SidebarResourceKey.HASHTAGS) ? [] : getSidebarHashtags(),
    exclude.includes(SidebarResourceKey.TOPICS) || !TOPICS_ENABLED
      ? []
      : getSidebarTopics(),
  ])

  return {
    sidebarHashtags,
    sidebarTopics,
  }
}

export default fetchSidebarData
