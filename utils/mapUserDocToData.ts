import type { FirebaseDoc, UserData, UserDataRequest } from '../types'

type MapUserDocToData = (userDoc: FirebaseDoc) => UserData

const mapUserDocToData: MapUserDocToData = userDoc => {
  const userData = userDoc.data() as UserDataRequest
  return {
    createdAt: userData.createdAt.toMillis(),
    firstName: userData.firstName,
    id: userDoc.id,
    lastName: userData.lastName,
    settings: userData.settings,
    shownFirstPostMessage: !!userData.shownFirstPostMessage,
    updatedAt: userData.updatedAt.toMillis(),
  }
}

export default mapUserDocToData
