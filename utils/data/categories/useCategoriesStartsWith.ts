import { useCallback, useState } from 'react'
import { Category } from '../../../types'

const useCategoriesStartsWith = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const search = useCallback(
    async (searchString: string): Promise<Category[]> => {
      if (!searchString) {
        setCategories([])
        return []
      }

      setIsLoading(true)
      const response = await fetch(
        `/api/categories?starts_with=${searchString}`
      )
      const categories = await response.json()
      setCategories(categories)
      setIsLoading(false)
      return categories
    },
    []
  )

  return {
    search,
    isLoading,
    categories,
  }
}

export default useCategoriesStartsWith
