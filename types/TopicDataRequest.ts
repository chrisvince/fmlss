import { firestore } from 'firebase-admin'

interface SubtopicSegmentRequest {
  path: string
  pathTitle: string
  slug: string
  title: string
}
export interface TopicDataRequest {
  createdAt: firestore.Timestamp
  description: string | null
  id: string
  path: string
  pathTitle: string
  popularityScoreAllTime: number
  popularityScoreRecent: number
  postCount: number
  postCountRecursive: number
  slug: string
  subtopicCount: number
  subtopicCountRecursive: number
  subtopicSegments: SubtopicSegmentRequest[]
  title: string
  updatedAt: firestore.Timestamp
  viewCount: number
}
