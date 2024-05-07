import { MetadataRoute } from 'next'
import constants from '../../constants'
import initFirebaseAdmin from '../../utils/initFirebaseAdmin'
import { firestore } from 'firebase-admin'

const { APP_URL, POST_SITEMAPS_COLLECTION } = constants

interface PostSitemapItem {
  lastModified: firestore.Timestamp
  slug: string
}

export const generateSitemaps = async () => {
  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  const collectionRef = db.collection(POST_SITEMAPS_COLLECTION)
  const total = (await collectionRef.count().get()).data().count

  const sitemapIds = Array.from({ length: total }, (_, i) => ({
    id: i.toString(),
  }))

  return sitemapIds
}

const sitemap = async ({
  id,
}: {
  id: string
}): Promise<MetadataRoute.Sitemap> => {
  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  const collectionRef = db.collection(POST_SITEMAPS_COLLECTION)
  const doc = await collectionRef.doc(id).get()
  const posts = doc.data()?.posts as PostSitemapItem[] | undefined

  if (!posts) {
    return []
  }

  return posts.map(({ slug, lastModified }) => ({
    changeFrequency: 'never',
    lastModified: lastModified.toDate(),
    url: `${APP_URL}/post/${slug}`,
  }))
}

export default sitemap
