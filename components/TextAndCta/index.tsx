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
    <Button component={Link} href={ctaHref} variant="outlined">
      {ctaText}
    </Button>
  </Box>
)

export default TextAndCta
