import url from 'url'
import http from 'http'
import https from 'https'
import sizeOf from 'image-size'

export interface ImageDimensions {
  height: number
  width: number
}

const handleBuffer = (buffer: Buffer) => {
  const sizeOfResult = sizeOf(buffer)
  const { height, width } = sizeOfResult
  if (!height || !width) throw new Error('Invalid image dimensions')
  return { height, width }
}

const getImageDimensionsFromUrl = (imgUrl: string): Promise<ImageDimensions> =>
  new Promise((resolve, reject) => {
    const options = url.parse(imgUrl)

    if (!options.protocol) {
      reject(new Error(`No protocol specified: ${imgUrl}`))
      return
    }

    const fetcher = {
      'https:': https,
      'http:': http,
    }[options.protocol]

    if (!fetcher) {
      reject(new Error(`"${imgUrl}" protocol is not supported`))
      return
    }

    fetcher.get(options, function (response) {
      const chunks: any[] = []

      response
        .on('data', chunk => {
          const buffer = Buffer.concat([...chunks, chunk])

          try {
            const { height, width } = handleBuffer(buffer)
            resolve({ height, width })
            response.destroy()
            return
          } catch (error: any) {
            if (error.message.includes('unsupported file type')) {
              response.destroy()
              reject(error)
              return
            }

            chunks.push(chunk)
          }
        })
        .on('end', () => {
          const buffer = Buffer.concat(chunks)

          try {
            const { height, width } = handleBuffer(buffer)
            resolve({ height, width })
          } catch (error: any) {
            reject(error)
          }
        })
    })
  })

export default getImageDimensionsFromUrl
