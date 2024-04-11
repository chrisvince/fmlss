export interface Media {
  height: number
  id: string
  src: string
  srcs: {
    url: string
    width: number
  }[]
  width: number
}
