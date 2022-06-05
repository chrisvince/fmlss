import * as functions from 'firebase-functions'
import incrementUserAuthoredPostsCount from
  './db/incrementUserAuthoredPostsCount'

import constants from './constants'

const { AUTHORED_POSTS_COLLECTION, USERS_COLLECTION } = constants

const path =
  `/${USERS_COLLECTION}/{userId}/${AUTHORED_POSTS_COLLECTION}/{postId}`

export const onUserAuthoredPostDelete = functions.firestore
    .document(path)
    .onDelete(async (_, context) => {
      const { userId } = context.params
      await incrementUserAuthoredPostsCount(-1, userId)
    })
