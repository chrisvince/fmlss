import { useRef } from 'react'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

type Resource = 'post' | 'category' | 'hashtag'

const resourceEventMap = {
  post: 'Post View',
  category: 'Category View',
  hashtag: 'Hashtag View',
}

interface Options {
  onceOnly: boolean
}

type EventFunction = (
  resource: Resource,
  data: {
    slug: string,
    [key: string]: any,
  },
  options?: Options,
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
