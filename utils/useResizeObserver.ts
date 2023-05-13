import { useEffect, useRef } from 'react'

const useResizeObserver = (
  onResize: (entries: ResizeObserverEntry[]) => void,
  options: { disable?: boolean } = {}
) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || options.disable || !onResize) return

    const resizeObserver = new ResizeObserver(entries => {
      onResize(entries)
    })

    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [onResize, options.disable])

  return ref
}

export default useResizeObserver
