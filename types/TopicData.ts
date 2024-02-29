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
