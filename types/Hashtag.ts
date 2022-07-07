import { HashtagData } from '.'
import type { FirebaseDoc } from '.'

export interface Hashtag {
  data: HashtagData
  doc: FirebaseDoc | null
}
