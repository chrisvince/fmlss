import { TopicData } from '.'
import type { FirebaseDoc } from '.'

export interface Topic {
  data: TopicData
  doc: FirebaseDoc | null
}
