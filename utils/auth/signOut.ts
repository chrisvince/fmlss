import { getAuth, signOut as signOutFirebase } from 'firebase/auth'
import constants from '../../constants'

const { AUTH_API_LOGOUT_PATH } = constants

const signOut = async (): Promise<void> => {
  const auth = getAuth()
  await signOutFirebase(auth)
  await fetch(AUTH_API_LOGOUT_PATH)
}

export default signOut
