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
  postCount: number
  postCountRecursive: number
  subtopicCountRecursive: number
  subtopicSegments: SubtopicSegmentRequest[]
  slug: string
  subtopicCount: number
  title: string
  updatedAt: firestore.Timestamp
  viewCount: number
}
