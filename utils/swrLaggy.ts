import { useRef, useEffect, useCallback } from 'react'
import { Middleware, SWRHook } from 'swr'

const laggy: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
  const swr = useSWRNext(key, fetcher, config)
  const laggyDataRef = useRef<typeof swr.data>()

  useEffect(() => {
    if (swr.data === undefined) return
    laggyDataRef.current = swr.data
  }, [swr.data])

  const resetLaggy = useCallback(() => {
    laggyDataRef.current = undefined
  }, [])

  const dataOrLaggyData =
    swr.data === undefined ? laggyDataRef.current : swr.data

  const isLagging = swr.data === undefined && laggyDataRef.current !== undefined

  return Object.assign({}, swr, {
    data: dataOrLaggyData,
    isLagging,
    resetLaggy,
  })
}

export default laggy
