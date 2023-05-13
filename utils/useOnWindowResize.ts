import { useEffect } from 'react'

interface Options {
  disable?: boolean
}

const useOnWindowResize = (
  fn: () => unknown,
  { disable = false }: Options = {}
) => {
  useEffect(() => {
    if (disable) return

    addEventListener('resize', fn)

    return () => {
      removeEventListener('resize', fn)
    }
  }, [disable, fn])
}

export default useOnWindowResize
