import { get as getMemoryCache, put as putMemoryCache } from 'memory-cache'
import isServer from './isServer'

const get = (key: string) => {
  if (!isServer) {
    throw new Error('get must be called on the server')
  }

  return getMemoryCache(key)
}

const put = (key: string, value: any, time?: number) => {
  if (!isServer) {
    throw new Error('put must be called on the server')
  }

  putMemoryCache(key, value, time)
}

export { get, put }
