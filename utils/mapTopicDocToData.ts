import type { TopicData, TopicDataRequest, FirebaseDoc } from '../types'

type MapTopicDocToData = (postDoc: FirebaseDoc) => TopicData

const mapTopicDocToData: MapTopicDocToData = doc => {
  const data = doc.data() as TopicDataRequest
  return {
    createdAt: data.createdAt.toMillis(),
    description: data.description ?? null,
    id: doc.id,
    path: data.path,
    pathTitle: data.pathTitle,
    popularityScoreAllTime: data.popularityScoreAllTime,
    popularityScoreRecent: data.popularityScoreRecent,
    postCount: data.postCount,
    postCountRecursive: data.postCountRecursive,
    ref: doc.ref.path,
    slug: data.slug,
    subtopicCount: data.subtopicCount,
    subtopicCountRecursive: data.subtopicCountRecursive,
    subtopicSegments: data.subtopicSegments,
    title: data.title,
    updatedAt: data.updatedAt.toMillis(),
    viewCount: data.viewCount,
  }
}

export default mapTopicDocToData
