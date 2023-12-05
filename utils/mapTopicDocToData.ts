import type { TopicData, TopicDataRequest, FirebaseDoc } from '../types'

type MapTopicDocToData = (postDoc: FirebaseDoc) => TopicData

const mapTopicDocToData: MapTopicDocToData = doc => {
  const data = doc.data() as TopicDataRequest
  return {
    createdAt: data.createdAt.toMillis(),
    id: doc.id,
    path: data.path,
    pathTitle: data.pathTitle,
    pathTitleSegments: data.pathTitleSegments,
    postCount: data.postCount,
    recentViewCount: data.recentViewCount,
    slug: data.slug,
    slugSegments: data.slugSegments,
    title: data.title,
    updatedAt: data.updatedAt.toMillis(),
    viewCount: data.viewCount,
  }
}

export default mapTopicDocToData
