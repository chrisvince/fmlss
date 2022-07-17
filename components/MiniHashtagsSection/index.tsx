import { Box } from '@mui/system'

import usePopularHashtags from '../../utils/data/hashtags/usePopularHashtags'
import MiniHashtagsList from '../MiniHashtagsList'
import MiniSectionHeading from '../MiniSectionHeading'

const MiniHashtagsSection = () => {
  const { isLoading, hashtags } = usePopularHashtags({
    swrConfig: {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  })

  return (
    <Box>
      <MiniSectionHeading>Popular Hashtags</MiniSectionHeading>
      <MiniHashtagsList hashtags={hashtags} isLoading={isLoading} />
    </Box>
  )
}

export default MiniHashtagsSection
