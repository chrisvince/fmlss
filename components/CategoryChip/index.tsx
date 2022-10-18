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
      sx={{ cursor: CATEGORIES_ENABLED ? 'pointer' : 'inherit' }}
      clickable={CATEGORIES_ENABLED}
    />
  )

  if (!CATEGORIES_ENABLED) {
    return chipElement
  }

  return (
    <Link href={`/category/${slug}`} passHref>
      <MuiLink underline="none" sx={{ display: 'flex' }}>
        {chipElement}
      </MuiLink>
    </Link>
  )
}

export default CategoryChip
