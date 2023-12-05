import { firestore } from 'firebase-admin'

export interface TopicDataRequest {
  createdAt: firestore.Timestamp
  id: string
  path: string
  pathTitle: string
  pathTitleSegments: string[]
  postCount: number
  recentViewCount: number
  slug: string
  slugSegments: string[]
  title: string
  updatedAt: firestore.Timestamp
  viewCount: number
}
