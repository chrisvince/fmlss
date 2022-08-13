import { Chip, Link as MuiLink } from '@mui/material'
import Link from 'next/link'

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
        label={name}
        size="small"
        variant="outlined"
        clickable
      />
    </MuiLink>
  </Link>
)

export default CategoryChip
