import type { TopicData, TopicDataRequest, FirebaseDoc } from '../types'

type MapTopicDocToData = (postDoc: FirebaseDoc) => TopicData

const mapTopicDocToData: MapTopicDocToData = doc => {
  const data = doc.data() as TopicDataRequest
  return {
    createdAt: data.createdAt.toMillis(),
    id: doc.id,
    name: data.name,
    postCount: data.postCount,
    recentViewCount: data.recentViewCount,
    slug: data.slug,
    updatedAt: data.updatedAt.toMillis(),
    viewCount: data.viewCount,
  }
}

export default mapTopicDocToData
