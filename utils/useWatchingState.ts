import { useCallback, useEffect, useState } from 'react'

const useWatchingState = (dataWatching: boolean) => {
  const [watching, setWatching] = useState<boolean>(dataWatching)

  const toggleWatching = useCallback(() => {
    if (watching) {
      setWatching(false)
      return
    }

    setWatching(true)
  }, [watching])

  useEffect(() => {
    setWatching(dataWatching)
  }, [dataWatching])

  return {
    toggleWatching,
    watching,
  }
}

export default useWatchingState
