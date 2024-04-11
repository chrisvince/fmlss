import getImageDimensionsFromUrl from '../../../utils/getImageDimensionsFromUrl'

export const GET = async (request: Request) => {
  const url = new URL(request.url).searchParams.get('url')

  if (!url) {
    return Response.json(
      { error: 'Query param `url` is required' },
      { status: 400 }
    )
  }

  try {
    const data = await getImageDimensionsFromUrl(url)
    return Response.json(data)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
