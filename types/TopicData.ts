export interface TopicData {
  createdAt: number
  description: string | null
  id: string
  path: string
  pathTitle: string
  pathTitleSegments: string[]
  postCount: number
  recentViewCount: number
  recursivePostCount: number
  recursiveSubtopicCount: number
  ref: string
  slug: string
  slugSegments: string[]
  subtopicCount: number
  title: string
  updatedAt: number
  viewCount: number
}
