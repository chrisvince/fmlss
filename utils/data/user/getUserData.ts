import { User } from '../../../types'
import constants from '../../../constants'
import mapUserDocToData from '../../mapUserDocToData'
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'

const { USERS_COLLECTION } = constants

const getUserData = async (uid: string): Promise<User | null> => {
  const db = getFirestore()
  const collectionRef = collection(db, USERS_COLLECTION)
  const dbRef = doc(collectionRef, uid)
  const userDoc = await getDoc(dbRef)
  if (!userDoc.exists()) return null
  const data = mapUserDocToData(userDoc)
  return { data }
}

export default getUserData
