import { Chip, Link as MuiLink, Tooltip } from '@mui/material'
import Link from 'next/link'

import truncateString from '../../utils/truncateString'
import constants from '../../constants'
import TruncatedPathTitle from '../TruncatedPathTitle'
import TopicPathTitleText from '../TopicPathTitleText'

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
      title={<TopicPathTitleText>{pathTitle}</TopicPathTitleText>}
    >
      <MuiLink
        component={Link}
        href={`/topic/${slug}`}
        sx={{
          display: 'flex',
          height: '1em',
          '&:hover': {
            borderBottom: '1px solid currentColor',
          },
        }}
        underline="none"
        variant="caption"
        color="text.secondary"
      >
        <TopicPathTitleText>
          <TruncatedPathTitle pathTitleSegments={pathTitleSegments} />
        </TopicPathTitleText>
      </MuiLink>
    </Tooltip>
  )
}

export default TopicBadge
