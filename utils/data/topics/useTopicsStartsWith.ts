import { useCallback, useState } from 'react'
import { Topic } from '../../../types'

const useTopicsStartsWith = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])

  const search = useCallback(async (searchString: string): Promise<Topic[]> => {
    if (!searchString) {
      setTopics([])
      return []
    }

    setIsLoading(true)
    const response = await fetch(`/api/topics?starts_with=${searchString}`)
    const topics = await response.json()
    setTopics(topics)
    setIsLoading(false)
    return topics
  }, [])

  return {
    search,
    isLoading,
    topics,
  }
}

export default useTopicsStartsWith
