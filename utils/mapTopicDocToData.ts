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
    postCount: data.postCount,
    postCountRecursive: data.postCountRecursive,
    subtopicCountRecursive: data.subtopicCountRecursive,
    ref: doc.ref.path,
    subtopicSegments: data.subtopicSegments,
    slug: data.slug,
    subtopicCount: data.subtopicCount,
    title: data.title,
    updatedAt: data.updatedAt.toMillis(),
    viewCount: data.viewCount,
  }
}

export default mapTopicDocToData
