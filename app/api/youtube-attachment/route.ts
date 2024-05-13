import getYouTubeAttachmentServer from '../../../utils/data/youtube/getYouTubeAttachmentServer'

export const GET = async (request: Request) => {
  const url = new URL(request.url).searchParams.get('url')

  if (!url) {
    return Response.json(
      { error: 'Query param `url` is required' },
      { status: 400 }
    )
  }

  try {
    const data = await getYouTubeAttachmentServer(url)
    return Response.json(data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
