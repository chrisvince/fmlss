import { useEffect, useRef } from 'react'
import isServer from './isServer'

const useDelayedOnMount = (fn: () => void, delay = 5000) => {
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (hasFiredRef.current || isServer) return

    const timeout = setTimeout(() => {
      fn()
      hasFiredRef.current = true
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [fn, delay])
}

export default useDelayedOnMount
