import { Link as MuiLink, Typography } from '@mui/material'
import { SubtopicSegment } from '../../types'
import Breadcrumbs from '../Breadcrumbs'
import Link from 'next/link'

interface Props {
  subtopicSegments: SubtopicSegment[]
}

const TopicBreadcrumbs = ({ subtopicSegments }: Props) => (
  <Breadcrumbs>
    {subtopicSegments.map(({ title, path }, index, array) =>
      index < array.length - 1 ? (
        <MuiLink
          component={Link}
          href={`/topic/${path}`}
          key={path}
          underline="hover"
        >
          {title}
        </MuiLink>
      ) : (
        <Typography key={path} color="primary.main" variant="caption">
          {title}
        </Typography>
      )
    )}
  </Breadcrumbs>
)

export default TopicBreadcrumbs
