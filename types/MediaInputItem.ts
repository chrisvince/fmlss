export enum MediaInputItemType {
  Image = 'image',
  Video = 'video',
}

export interface MediaInputItemCommon {
  id: string
  type: MediaInputItemType
}

export interface MediaInputItemImage extends MediaInputItemCommon {
  height: number
  id: string
  type: MediaInputItemType.Image
  url: string
  width: number
}

export enum MediaInputItemVideoStatus {
  Processing = 'processing',
  Ready = 'ready',
}

export interface MediaInputItemVideo extends MediaInputItemCommon {
  aspectRatio?: string
  id: string
  passthrough: string
  playbackId?: string
  status: MediaInputItemVideoStatus
  type: MediaInputItemType.Video
}

export type MediaInputItem = MediaInputItemImage | MediaInputItemVideo
