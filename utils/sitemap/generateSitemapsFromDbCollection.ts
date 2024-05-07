import initFirebaseAdmin from '../initFirebaseAdmin'

const generateSitemapsFromDbCollection = async (
  collection: string
): Promise<{ id: string }[]> => {
  const firebase = initFirebaseAdmin()
  const db = firebase.firestore()
  const collectionRef = db.collection(collection)
  const total = (await collectionRef.count().get()).data().count

  const sitemapIds = Array.from({ length: total }, (_, i) => ({
    id: i.toString(),
  }))

  return sitemapIds
}

export default generateSitemapsFromDbCollection
