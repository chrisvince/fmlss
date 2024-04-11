import { ImageDimensions } from './getImageDimensionsFromUrl'

const getImageDimensionsFromUrlClient = async (
  url: string
): Promise<ImageDimensions> => {
  const response = await fetch(
    `/api/image-dimensions?url=${encodeURIComponent(url)}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data as ImageDimensions
}

export default getImageDimensionsFromUrlClient
