import { useRef } from 'react'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

type Event = 'Page View' | 'Post View' | 'Category View' | 'Hashtag View'

interface Options {
  onceOnly: boolean
}

type EventFunction = (event: Event, data: any, options: Options) => void

type UseTracking = () => {
  track: EventFunction
}

const useTracking: UseTracking = () => {
  const eventFiredRef = useRef<boolean>(false)

  const track: EventFunction = (
    event,
    data,
    { onceOnly }
  ) => {
    if (typeof window === 'undefined') return
    if (onceOnly && eventFiredRef.current) return
    eventFiredRef.current = true

    if (!window.dataLayer) {
      window.dataLayer = []
    }

    window.dataLayer?.push({
      event,
      ...data,
    })
  }

  return {
    track,
  }
}

export default useTracking
