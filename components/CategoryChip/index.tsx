import { Chip, Link as MuiLink } from '@mui/material'
import Link from 'next/link'

import truncateString from '../../utils/truncateString'
import constants from '../../constants'

const { CATEGORIES_ENABLED } = constants

interface Props {
  name: string
  slug: string
}

const CategoryChip = ({ name, slug }: Props) => {
  const chipElement = (
    <Chip
      label={truncateString(name)}
      size="small"
      variant="outlined"
      sx={{
        cursor: CATEGORIES_ENABLED ? 'pointer' : 'inherit',
        height: '20px',
      }}
      clickable={CATEGORIES_ENABLED}
    />
  )

  if (!CATEGORIES_ENABLED) {
    return chipElement
  }

  return (
    <MuiLink
      component={Link}
      href={`/category/${slug}`}
      sx={{ display: 'flex' }}
      underline="none"
    >
      {chipElement}
    </MuiLink>
  )
}

export default CategoryChip
