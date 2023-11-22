import { Chip, Link as MuiLink, Tooltip } from '@mui/material'
import Link from 'next/link'

import truncateString from '../../utils/truncateString'
import constants from '../../constants'
import { AlternateEmailRounded } from '@mui/icons-material'
import TruncatedPathTitle from '../TruncatedPathTitle'
import { Box } from '@mui/system'

const { TOPICS_ENABLED } = constants

interface Props {
  pathTitleSegments: string[]
  slug: string
  pathTitle: string
}

const TopicBadge = ({ pathTitleSegments, slug, pathTitle }: Props) => {
  const chipElement = (
    <Chip
      label={truncateString(pathTitle)}
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
    <Tooltip
      placement="bottom"
      title={
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.1 }}>
          <AlternateEmailRounded fontSize="inherit" color="inherit" />
          {pathTitle}
        </Box>
      }
    >
      <MuiLink
        component={Link}
        href={`/topic/${slug}`}
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 0.1,
          height: '1em',
          overflow: 'hidden',
          '&:hover': {
            borderBottom: '1px solid currentColor',
            marginBottom: '-1px',
          },
        }}
        underline="none"
        variant="caption"
        color="text.secondary"
      >
        <AlternateEmailRounded fontSize="inherit" color="inherit" />
        <TruncatedPathTitle pathTitleSegments={pathTitleSegments} />
      </MuiLink>
    </Tooltip>
  )
}

export default TopicBadge
