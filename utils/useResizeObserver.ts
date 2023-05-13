import { useEffect, useRef } from 'react'

const useResizeObserver = (
  onResize: (entries: ResizeObserverEntry[]) => void,
  dependencies: unknown[] = [],
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
  }, [...dependencies, options.disable])

  return ref
}

export default useResizeObserver
