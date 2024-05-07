import { SitemapItem } from '../../types/SitemapItem'
import initFirebaseAdmin from '../initFirebaseAdmin'

const getDbSitemapDoc = async (
  id: string,
  collection: string
): Promise<SitemapItem[] | undefined> => {
  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  const collectionRef = db.collection(collection)
  const doc = await collectionRef.doc(id).get()
  return doc.data()?.posts
}

export default getDbSitemapDoc
