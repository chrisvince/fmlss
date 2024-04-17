import { UserRecord } from 'firebase-admin/lib/auth/user-record'
import { getFunctions, httpsCallable } from 'firebase/functions'

interface Input {
  email: string
  password: string
}

export const createUser = (data: Input) => {
  const functions = getFunctions()
  return httpsCallable<Input, UserRecord>(functions, 'auth-create')(data)
}
