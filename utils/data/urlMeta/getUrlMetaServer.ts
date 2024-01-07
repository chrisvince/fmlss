import { Image, PostAttachmentUrl } from '../../../types'
import getMetaData from 'html-metadata-parser'
import mapPostAttachmentUrl from './mapPostAttachmentUrl'
import validateUrl from '../../validateUrl'
import getImageDimensionsFromUrl, {
  ImageDimensions,
} from '../../getImageDimensionsFromUrl'
import promiseTimeout from '../../promiseTimeout'

export interface UrlMeta {
  description: string
  image: Image | undefined
  siteName: string
  title: string
  type: string
  url: string
}

const getUrlMetaServer = async (url: string): Promise<PostAttachmentUrl> => {
  const meta = await promiseTimeout(getMetaData(url))

  const imageSrc =
    validateUrl(meta.meta.image) ??
    validateUrl(meta.og.image) ??
    validateUrl((meta.images?.at(0) as unknown as { src: string })?.src)

  let imageDimensions: ImageDimensions | undefined

  if (imageSrc) {
    try {
      imageDimensions = await promiseTimeout(
        getImageDimensionsFromUrl(imageSrc),
        5_000
      )
    } catch (error) {
      // nothing needed
    }
  }

  const image: Image | null =
    imageSrc && imageDimensions
      ? {
          alt: meta.meta.title ?? meta.og.title ?? '',
          height: imageDimensions.height,
          src: imageSrc,
          width: imageDimensions.width,
        }
      : null

  const mappedData = mapPostAttachmentUrl(meta, image)
  return mappedData
}

export default getUrlMetaServer
