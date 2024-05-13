import { MediaImage } from '../types/Media'

const resolveSrcSetFromMediaSrcs = (srcs: MediaImage['srcs']) =>
  srcs.map(({ url, width }) => `${url} ${width}w`).join(', ')

export default resolveSrcSetFromMediaSrcs
