import { NextApiRequest, NextApiResponse } from 'next'
import getUrlMetaServer from '../../utils/data/urlMeta/getUrlMetaServer'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const { url } = query as { url: string }

  if (!url) {
    return res.status(400).json({
      error: 'Query param `url` is required',
    })
  }

  try {
    const data = await getUrlMetaServer(url)
    return res.status(200).json(data)
  } catch (error: any) {
    if (error.code === 'ENOTFOUND') {
      return res.status(404).json({ error: 'URL not found' })
    }

    return res.status(500).json({ error: error.message })
  }
}

export default handler
