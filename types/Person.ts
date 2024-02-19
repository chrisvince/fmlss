import { FirebaseDoc } from './FirebaseDoc'
import { PersonData } from './PersonData'

export interface Person {
  data: PersonData
  doc: FirebaseDoc | null
}
