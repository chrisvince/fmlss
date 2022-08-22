import { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import fetchMeta from 'fetch-meta-tags'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const { url } = query as { url: string }

  if (!url) {
    return res.status(400).json({
      error: 'Query param `url` is required',
    })
  }

  const meta = await fetchMeta(url)
  return res.status(200).json(meta)
}

export default handler
