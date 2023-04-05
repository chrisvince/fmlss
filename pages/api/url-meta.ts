import { NextApiRequest, NextApiResponse } from 'next'
import getMetaData, { Metadata } from 'html-metadata-parser'

const mapMeta = ({ images, meta, og }: Metadata) => ({
  title: meta.title ?? og.title,
  description: meta.description ?? og.description,
  image:
    meta.image ??
    og.image ??
    (images?.at(-1) as unknown as { src: string })?.src,
  url: meta.url ?? og.url,
  type: meta.type ?? og.type,
  siteName: meta.site_name ?? og.site_name,
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const { url } = query as { url: string }

  if (!url) {
    return res.status(400).json({
      error: 'Query param `url` is required',
    })
  }

  try {
    const meta = await getMetaData(url)
    const mappedMeta = mapMeta(meta)
    return res.status(200).json(mappedMeta)
  } catch (error: any) {
    if (error.code === 'ENOTFOUND') {
      return res.status(404)
    }
    return res.status(500)
  }
}

export default handler
