import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import useHashtags from '../../utils/data/hashtags/useHashtags'
import MiniHashtagsList from '../MiniHashtagsList'

const MiniHashtagsSection = () => {
  const { isLoading, hashtags } = useHashtags({ sortMode: 'popular' })

  return (
    <Box>
      <Typography
        variant="h6"
      >
        Popular Hashtags
      </Typography>
      <MiniHashtagsList
        hashtags={hashtags}
        isLoading={isLoading}
      />
    </Box>
  )
}

export default MiniHashtagsSection
