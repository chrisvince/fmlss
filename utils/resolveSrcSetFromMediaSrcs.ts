import { Media } from '../types/Media'

const resolveSrcSetFromMediaSrcs = (srcs: Media['srcs']) =>
  srcs.map(({ url, width }) => `${url} ${width}w`).join(', ')

export default resolveSrcSetFromMediaSrcs
