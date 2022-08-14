import { Chip, Link as MuiLink } from '@mui/material'
import Link from 'next/link'

import truncateString from '../../utils/truncateString'

interface Props {
  name: string
  slug: string
}

const CategoryChip = ({ name, slug }: Props) => (
  <Link href={`/category/${slug}`} passHref>
    <MuiLink
      underline="none"
      sx={{ display: 'flex' }}
    >
      <Chip
        label={truncateString(name)}
        size="small"
        variant="outlined"
        clickable
      />
    </MuiLink>
  </Link>
)

export default CategoryChip
