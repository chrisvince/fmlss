import { firestore } from 'firebase-admin'

export interface TopicDataRequest {
  createdAt: firestore.Timestamp
  description: string | null
  id: string
  path: string
  pathTitle: string
  pathTitleSegments: string[]
  postCount: number
  recursivePostCount: number
  recursiveSubtopicCount: number
  recentViewCount: number
  slug: string
  slugSegments: string[]
  subtopicCount: number
  title: string
  updatedAt: firestore.Timestamp
  viewCount: number
}
