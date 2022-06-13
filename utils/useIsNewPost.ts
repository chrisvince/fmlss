import { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import constants from '../functions/src/constants'
import { PostData } from '../types'

const db = firebase.firestore()

const { POSTS_COLLECTION } = constants

type HandleSnapshot = (snapshow: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void

const useIsNewPost = (
  posts?: PostData[],
  collectionPath: string = POSTS_COLLECTION,
  { sortDirection }:
    { sortDirection: 'desc' | 'asc' } = { sortDirection: 'desc' }
) => {
  const [isNewPost, setIsNewPost] = useState<boolean>(false)

  useEffect(() => {
    if (isNewPost || !posts) return

    const handleSnapshot: HandleSnapshot = (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const post = posts[{ desc: 0, asc: posts.length - 1 }[sortDirection]]
        if (change.type !== 'added') return
        if (!post?.id && !change.doc.id) return
        if (change.doc.id === post?.id) return
        setIsNewPost(true)
        unsubscribe()
      })
    }

    const unsubscribe = {
      asc: db
        .collection(collectionPath)
        .orderBy('createdAt', 'asc')
        .limitToLast(1)
        .onSnapshot(handleSnapshot),
      desc: db
        .collection(collectionPath)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot(handleSnapshot),
    }[sortDirection]

    return () => {
      unsubscribe()
    }
  }, [collectionPath, isNewPost, posts, sortDirection])

  return isNewPost
}

export default useIsNewPost
