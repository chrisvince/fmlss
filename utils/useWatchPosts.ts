import { useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import constants from '../functions/src/constants'
import mapPostDbToClient from './mapPostDbToClient'
import { Post } from '../types'

const db = firebase.firestore()

const { POSTS_COLLECTION } = constants

interface Options {
  reference?: string
  sortDirection?: 'asc' | 'desc'
  types?: ('added' | 'modified' | 'removed')[]
}

const useWatchPosts = (
  onChange: (posts: Post[]) => any,
  {
    reference = POSTS_COLLECTION,
    sortDirection = 'desc',
    types = ['added'],
  }: Options = {}
) => {
  useEffect(() => {
    const unsubscribe = db
      .collection(reference)
      .orderBy('createdAt', sortDirection)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(({ type }) => {
          if (!types.includes(type)) return
          const posts = snapshot.docs.map((doc) => mapPostDbToClient(doc))
          onChange(posts)
        })
      })

    return () => {
      unsubscribe()
    }
  }, [onChange, reference, sortDirection, types])
}

export default useWatchPosts
