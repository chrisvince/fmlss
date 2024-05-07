import { firestore } from 'firebase-admin'

export interface SitemapItem {
  lastModified: firestore.Timestamp
  slug: string
}
