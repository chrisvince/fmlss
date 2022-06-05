import firebase from 'firebase/app'
import 'firebase/functions'

const functions = firebase.functions()

interface Input {
  uid: string
}

export const checkUserHasPassword = functions.httpsCallable(
  'checkUserHasPassword'
) as (data: Input) => Promise<{ data: boolean }>

