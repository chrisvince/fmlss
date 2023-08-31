import { Box } from '@mui/system'

import usePopularTopics from '../../utils/data/topics/usePopularTopics'
import SidebarTopicsList from '../SidebarTopicsList'
import SidebarSectionHeading from '../SidebarSectionHeading'

const SidebarTopicsSection = () => {
  const { isLoading, topics } = usePopularTopics({
    swrConfig: {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  })

  if (!isLoading && !topics.length) return null

  return (
    <Box>
      <SidebarSectionHeading>Popular Topics</SidebarSectionHeading>
      <SidebarTopicsList topics={topics} isLoading={isLoading} />
    </Box>
  )
}

export default SidebarTopicsSection
