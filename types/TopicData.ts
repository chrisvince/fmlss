export interface SubtopicSegment {
  path: string
  pathTitle: string
  slug: string
  title: string
}

export interface TopicData {
  createdAt: number
  description: string | null
  id: string
  path: string
  pathTitle: string
  popularityScoreAllTime: number
  popularityScoreRecent: number
  postCount: number
  postCountRecursive: number
  ref: string
  slug: string
  subtopicCount: number
  subtopicCountRecursive: number
  subtopicSegments: SubtopicSegment[]
  title: string
  updatedAt: number
  viewCount: number
}
