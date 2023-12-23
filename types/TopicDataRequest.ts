import { firestore } from 'firebase-admin'

interface SubtopicSegmentRequest {
  path: string
  pathTitle: string
}
export interface TopicDataRequest {
  createdAt: firestore.Timestamp
  description: string | null
  id: string
  path: string
  pathTitle: string
  postCount: number
  recentViewCount: number
  recursivePostCount: number
  recursiveSubtopicCount: number
  subtopicSegments: SubtopicSegmentRequest[]
  slug: string
  subtopicCount: number
  title: string
  updatedAt: firestore.Timestamp
  viewCount: number
}
