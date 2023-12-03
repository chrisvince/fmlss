import { FirebaseDoc } from './FirebaseDoc'
import { NotificationData } from './NotificationData'

export interface Notification {
  data: NotificationData
  doc: FirebaseDoc | null
}
