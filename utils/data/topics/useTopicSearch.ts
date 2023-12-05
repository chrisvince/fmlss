import { useCallback, useState } from 'react'
import { Topic } from '../../../types'
import slugify from '../../slugify'

const useTopicSearch = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])

  const search = useCallback(async (segments: string[]): Promise<Topic[]> => {
    const searchString = segments.map(slugify).join('--')
    setIsLoading(true)
    const response = await fetch(`/api/topics?starts_with=${searchString}`)
    const topics = await response.json()
    setTopics(topics)
    setIsLoading(false)
    return topics
  }, [])

  const clear = useCallback(() => {
    setTopics([])
  }, [])

  return {
    clear,
    search,
    isLoading,
    topics,
  }
}

export default useTopicSearch
