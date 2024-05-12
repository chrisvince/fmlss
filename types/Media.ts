export enum MediaType {
  Image = 'image',
  Video = 'video',
}

export interface MediaImage {
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

export interface MediaVideo {
  aspectRatio: string
  id: string
  playbackId: string
  type: MediaType.Video
}

export type Media = MediaImage | MediaVideo
