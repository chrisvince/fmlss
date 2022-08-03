import { UserData } from '.'
import type { FirebaseDoc } from '.'

export interface User {
  data: UserData
  doc: FirebaseDoc | null
}
