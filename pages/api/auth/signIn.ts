import { setAuthCookies } from 'next-firebase-auth'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('req', req)
  try {
    await setAuthCookies(req, res)
  } catch (error) {
    return res.status(500).json({ error })
  }
  return res.status(200).json({ success: true })
}

export default handler
