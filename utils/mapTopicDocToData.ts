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
    pathTitleSegments: data.pathTitleSegments,
    postCount: data.postCount,
    recentViewCount: data.recentViewCount,
    recursivePostCount: data.recursivePostCount,
    recursiveSubtopicCount: data.recursiveSubtopicCount,
    ref: doc.ref.path,
    slug: data.slug,
    slugSegments: data.slugSegments,
    subtopicCount: data.subtopicCount,
    title: data.title,
    updatedAt: data.updatedAt.toMillis(),
    viewCount: data.viewCount,
  }
}

export default mapTopicDocToData
