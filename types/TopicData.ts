export interface SubtopicSegment {
  path: string
  pathTitle: string
}

export interface TopicData {
  createdAt: number
  description: string | null
  id: string
  path: string
  pathTitle: string
  postCount: number
  recentViewCount: number
  recursivePostCount: number
  recursiveSubtopicCount: number
  ref: string
  subtopicSegments: SubtopicSegment[]
  slug: string
  subtopicCount: number
  title: string
  updatedAt: number
  viewCount: number
}
