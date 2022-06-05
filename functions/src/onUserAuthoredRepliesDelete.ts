import * as functions from 'firebase-functions'
import incrementUserAuthoredRepliesCount from
  './db/incrementUserAuthoredRepliesCount'

import constants from './constants'

const { AUTHORED_REPLIES_COLLECTION, USERS_COLLECTION } = constants

const path =
  `/${USERS_COLLECTION}/{userId}/${AUTHORED_REPLIES_COLLECTION}/{postId}`

export const onUserAuthoredRepliesDelete = functions.firestore
    .document(path)
    .onDelete(async (_, context) => {
      const { userId } = context.params
      await incrementUserAuthoredRepliesCount(-1, userId)
    })
