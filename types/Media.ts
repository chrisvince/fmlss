enum MediaType {
  Image = 'image',
}

interface MediaImage {
  height: number
  id: string
  src: string
  srcs: {
    url: string
    width: number
  }[]
  type: MediaType.Image
  width: number
}

export type Media = MediaImage
