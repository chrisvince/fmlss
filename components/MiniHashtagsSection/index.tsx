import { Box } from '@mui/system'

import useHashtags from '../../utils/data/hashtags/useHashtags'
import MiniHashtagsList from '../MiniHashtagsList'
import MiniSectionHeading from '../MiniSectionHeading'

const MiniHashtagsSection = () => {
  const { isLoading, hashtags } = useHashtags({ sortMode: 'popular' })

  return (
    <Box>
      <MiniSectionHeading>Popular Hashtags</MiniSectionHeading>
      <MiniHashtagsList hashtags={hashtags} isLoading={isLoading} />
    </Box>
  )
}

export default MiniHashtagsSection
