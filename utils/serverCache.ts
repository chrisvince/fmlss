import { get as getMemoryCache, put as putMemoryCache } from 'memory-cache'
import isServer from './isServer'

const get = (key: string) => {
  if (!isServer) {
    return null
  }

  return getMemoryCache(key)
}

const put = (key: string, value: any, time?: number) => {
  if (!isServer) {
    return
  }

  putMemoryCache(key, value, time)
}

export { get, put }
