import { UserRecord } from 'firebase-admin/lib/auth/user-record'
import firebase from 'firebase/app'
import 'firebase/functions'

interface Input {
  email: string
  password: string
}

type CreateUser = (data: Input) => Promise<{ data: UserRecord }>

export const createUser: CreateUser = (data) => {
  const functions = firebase.functions()
  return functions.httpsCallable('auth-create')(data)
}
