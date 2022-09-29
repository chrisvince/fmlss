import { Button, Typography } from "@mui/material"
import { Box } from "@mui/system"
import Link from "next/link"

const TextAndCta = ({
  message,
  ctaText,
  ctaHref,
}: {
  message: string
  ctaText: string
  ctaHref: string
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: 4,
    }}
  >
    <Typography variant="body1">{message}</Typography>
    <Link href={ctaHref} passHref>
      <Button variant="outlined">
        {ctaText}
      </Button>
    </Link>
  </Box>
)

export default TextAndCta
