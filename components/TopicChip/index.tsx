import { Chip, Link as MuiLink } from '@mui/material'
import Link from 'next/link'

import truncateString from '../../utils/truncateString'
import constants from '../../constants'

const { TOPICS_ENABLED } = constants

interface Props {
  slug: string
  title: string
}

const TopicChip = ({ slug, title }: Props) => {
  const chipElement = (
    <Chip
      label={truncateString(title)}
      size="small"
      variant="outlined"
      sx={{
        cursor: TOPICS_ENABLED ? 'pointer' : 'inherit',
        height: '20px',
      }}
      clickable={TOPICS_ENABLED}
    />
  )

  if (!TOPICS_ENABLED) {
    return chipElement
  }

  return (
    <MuiLink
      component={Link}
      href={`/topic/${slug}`}
      sx={{ display: 'flex' }}
      underline="none"
    >
      {chipElement}
    </MuiLink>
  )
}

export default TopicChip
