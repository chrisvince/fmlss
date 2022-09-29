import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'

interface Props {
  ctaHref: string
  ctaText: string
  message: string
  variant?: 'standard' | 'error'
}

const TextAndCta = ({
  ctaHref,
  ctaText,
  message,
  variant = 'standard',
}: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: 4,
    }}
  >
    <Typography
      sx={{ color: variant === 'error' ? 'error.main' : 'text.primary' }}
      variant="body1"
    >
      {message}
    </Typography>
    <Link href={ctaHref} passHref>
      <Button variant="outlined">{ctaText}</Button>
    </Link>
  </Box>
)

export default TextAndCta
