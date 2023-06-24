import type { FirebaseDoc, UserData, UserDataRequest } from '../types'

type MapUserDocToData = (userDoc: FirebaseDoc) => UserData

const mapUserDocToData: MapUserDocToData = userDoc => {
  const userData = userDoc.data() as UserDataRequest
  return {
    createdAt: userData.createdAt.toMillis(),
    firstName: userData.firstName,
    id: userDoc.id,
    lastName: userData.lastName,
    shownFirstPostMessage: !!userData.shownFirstPostMessage,
    updatedAt: userData.updatedAt.toMillis(),
    username: userData.username,
  }
}

export default mapUserDocToData
