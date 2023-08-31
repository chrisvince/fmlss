import { NextApiRequest, NextApiResponse } from 'next'
import { getFirebaseAdmin } from 'next-firebase-auth'

import getTopicsStartsWith from '../../../utils/data/topics/getTopicsStartsWith'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const { starts_with: startsWith } = query as { starts_with: string }

  if (!startsWith) {
    return res.status(400).json({
      error: 'Query param `starts-with` is required',
    })
  }

  const admin = getFirebaseAdmin()
  const adminDb = admin.firestore()

  const topics = await getTopicsStartsWith(startsWith, {
    db: adminDb,
  })

  return res.status(200).json(topics)
}

export default handler
