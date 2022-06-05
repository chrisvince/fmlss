import * as functions from 'firebase-functions'
import incrementUserAuthoredRepliesCount from
  './db/incrementUserAuthoredRepliesCount'

import constants from './constants'

const { AUTHORED_REPLIES_COLLECTION, USERS_COLLECTION } = constants

const path =
  `/${USERS_COLLECTION}/{userId}/${AUTHORED_REPLIES_COLLECTION}/{postId}`

export const onUserAuthoredRepliesCreate = functions.firestore
    .document(path)
    .onCreate(async (_, context) => {
      const { userId } = context.params
      await incrementUserAuthoredRepliesCount(1, userId)
    })
