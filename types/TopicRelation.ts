import { SubtopicSegment } from './TopicData'

export interface TopicRelation {
  path: string
  pathTitle: string
  slug: string
  subtopicSegments: SubtopicSegment[]
  title: string
}
