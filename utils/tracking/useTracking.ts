import { useRef } from 'react'

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

type Resource = 'post' | 'topic' | 'hashtag'

const resourceEventMap = {
  post: 'Post View',
  topic: 'Topic View',
  hashtag: 'Hashtag View',
}

interface Options {
  onceOnly: boolean
}

type EventFunction = (
  resource: Resource,
  data: {
    slug: string
    [key: string]: unknown
  },
  options?: Options
) => void

type UseTracking = () => {
  track: EventFunction
}

const useTracking: UseTracking = () => {
  const eventFiredRef = useRef<boolean>(false)

  const track: EventFunction = (
    resource,
    data,
    { onceOnly } = { onceOnly: false }
  ) => {
    if (typeof window === 'undefined') return
    if (onceOnly && eventFiredRef.current) return
    eventFiredRef.current = true
    const event = resourceEventMap[resource]

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
