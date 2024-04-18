import {
  UserCredential,
  getAuth,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
} from 'firebase/auth'
import constants from '../../constants'

const { AUTH_API_LOGIN_PATH } = constants

const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const auth = getAuth()

  const credential = await signInWithEmailAndPasswordFirebase(
    auth,
    email,
    password
  )

  const idToken = await credential.user.getIdToken()

  await fetch(AUTH_API_LOGIN_PATH, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })

  return credential
}

export default signInWithEmailAndPassword
