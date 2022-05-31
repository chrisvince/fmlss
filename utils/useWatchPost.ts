import { useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import mapPostDbToClient from './mapPostDbToClient'
import { Post } from '../types'

const db = firebase.firestore()

interface Options {
  reference: string
}

const useWatchPost = (
  onChange: (posts: Post) => any,
  { reference }: Options
) => {
  useEffect(() => {
    if (!reference) return

    const unsubscribe = db.doc(reference).onSnapshot(doc => {
      const post = mapPostDbToClient(doc)
      onChange(post)
    })

    return () => {
      unsubscribe()
    }
  }, [onChange, reference])
}

export default useWatchPost
