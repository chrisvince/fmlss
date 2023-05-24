import { Box } from '@mui/system'

import usePopularHashtags from '../../utils/data/hashtags/usePopularHashtags'
import SidebarHashtagsList from '../SidebarHashtagsList'
import SidebarSectionHeading from '../SidebarSectionHeading'

const SidebarHashtagsSection = () => {
  const { isLoading, hashtags } = usePopularHashtags({
    swrConfig: {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  })

  if (!isLoading && !hashtags.length) return null

  return (
    <Box>
      <SidebarSectionHeading>Popular Hashtags</SidebarSectionHeading>
      <SidebarHashtagsList hashtags={hashtags} isLoading={isLoading} />
    </Box>
  )
}

export default SidebarHashtagsSection
