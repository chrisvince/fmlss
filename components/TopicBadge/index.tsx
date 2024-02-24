import { Link as MuiLink, Tooltip } from '@mui/material'
import Link from 'next/link'

import TruncatedPathTitle from '../TruncatedPathTitle'
import TopicPathTitleText from '../TopicPathTitleText'
import { SubtopicSegment } from '../../types'

interface Props {
  pathTitle: string
  slug: string
  subtopicSegments: SubtopicSegment[]
}

const TopicBadge = ({ pathTitle, slug, subtopicSegments }: Props) => (
  <Tooltip placement="bottom" title={pathTitle}>
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
        <TruncatedPathTitle subtopicSegments={subtopicSegments} />
      </TopicPathTitleText>
    </MuiLink>
  </Tooltip>
)

export default TopicBadge
