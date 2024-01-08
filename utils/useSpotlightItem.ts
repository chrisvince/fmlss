import SpotlightContext, {
  SpotlightElement,
} from '../contexts/SpotlightContext'
import { useCallback, useContext } from 'react'

const useSpotlightItem = (key: SpotlightElement) => {
  const context = useContext(SpotlightContext)

  if (!context) {
    throw new Error(
      'useSpotlightContext must be used within a SpotlightContextProvider'
    )
  }

  const { spotlightItem, setSpotlightItem } = context

  const setSpotlight = useCallback(
    (spotlight: boolean) => {
      if (!spotlight) {
        setSpotlightItem(null)
        return
      }

      setSpotlightItem(key)
    },
    [key, setSpotlightItem]
  )

  return {
    isSpotlight: spotlightItem === key,
    setSpotlight,
  }
}

export default useSpotlightItem
