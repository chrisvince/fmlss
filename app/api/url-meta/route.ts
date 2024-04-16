import getUrlMetaServer from '../../../utils/data/urlMeta/getUrlMetaServer'
import mapPostAttachmentUrl from '../../../utils/data/urlMeta/mapPostAttachmentUrl'

export const GET = async (request: Request) => {
  const url = new URL(request.url).searchParams.get('url')

  if (!url) {
    return Response.json(
      { error: 'Query param `url` is required' },
      { status: 400 }
    )
  }

  try {
    const data = await getUrlMetaServer(url)
    return Response.json(data)
  } catch (error: any) {
    if (error.code === 'ENOTFOUND') {
      const notFoundPostAttachment = mapPostAttachmentUrl(
        { meta: { url, title: url }, og: {} },
        null,
        url
      )

      return Response.json(notFoundPostAttachment)
    }

    return Response.json({ error: error.message }, { status: 500 })
  }
}
