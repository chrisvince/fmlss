import * as functions from 'firebase-functions'
import incrementUserPostCounts from
  './db/incrementUserPostCounts'

import constants from './constants'

const { AUTHORED_POSTS_COLLECTION, USERS_COLLECTION } = constants

const path =
  `/${USERS_COLLECTION}/{userId}/${AUTHORED_POSTS_COLLECTION}/{postId}`

export const onUserAuthoredPostDelete = functions.firestore
    .document(path)
    .onDelete(async (snapshot, context) => {
      const { userId } = context.params
      const { type } = snapshot.data() as { type: 'reply' | 'post' }
      await incrementUserPostCounts(-1, userId, type)
    })
