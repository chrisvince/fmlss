import { useEffect, useRef } from 'react'
import isServer from './isServer'

const useOnMount = (fn: () => void, condition?: any) => {
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (
      hasFiredRef.current ||
      isServer ||
      (condition !== undefined && !condition)
    )
      return
    fn()
    hasFiredRef.current = true
  }, [condition, fn])
}

export default useOnMount
