import { CategoryData } from '.'
import type { FirebaseDoc } from '.'

export interface Category {
  data: CategoryData
  doc: FirebaseDoc | null
}
