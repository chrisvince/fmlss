import { Box } from '@mui/system'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  height: number
  width: number
  padded?: boolean
}

const Brand = ({ height, padded = false, width }: Props) => (
  <Box
    component={Link}
    href="/"
    sx={{
      display: 'flex',
      padding: padded ? 1 : undefined,
      margin: padded ? -1 : undefined,
    }}
  >
    <Image alt="FAMELESS" src="/fameless.svg" height={height} width={width} />
  </Box>
)

export default Brand
