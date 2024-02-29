import getUrlMetaServer from '../../../utils/data/urlMeta/getUrlMetaServer'

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
      return Response.json({ error: 'URL not found' }, { status: 404 })
    }

    return Response.json({ error: error.message }, { status: 500 })
  }
}
