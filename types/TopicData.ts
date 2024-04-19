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
  postCount: number
  postCountRecursive: number
  subtopicCountRecursive: number
  ref: string
  subtopicSegments: SubtopicSegment[]
  slug: string
  subtopicCount: number
  title: string
  updatedAt: number
  viewCount: number
}
