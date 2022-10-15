import type { FirebaseDoc, UserData } from '../types'

type MapUserDocToData = (userDoc: FirebaseDoc) => UserData

const mapUserDocToData: MapUserDocToData = userDoc => {
  const userData = userDoc.data()!
  return {
    createdAt: userData.createdAt.toMillis() as string,
    id: userDoc.id as string,
    shownFirstPostMessage: !!userData.shownFirstPostMessage as boolean,
    updatedAt: userData.updatedAt.toMillis() as string,
    username: userData.username as string,
  }
}

export default mapUserDocToData
