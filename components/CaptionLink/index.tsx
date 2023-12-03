import Link from 'next/link'
import { Link as MuiLink, Tooltip, TooltipProps } from '@mui/material'

interface PropTypes {
  children: React.ReactNode
  color?: string
  href: string
  tooltip?: string
  tooltipPlacement?: TooltipProps['placement']
}

const CaptionLink = ({
  children,
  color = 'text.secondary',
  href,
  tooltip,
  tooltipPlacement,
}: PropTypes) => {
  const muiLink = (
    <MuiLink
      component={Link}
      href={href}
      variant="caption"
      sx={{
        textDecoration: 'none',
        color,
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      {children}
    </MuiLink>
  )

  return tooltip ? (
    <Tooltip placement={tooltipPlacement} title={tooltip}>
      {muiLink}
    </Tooltip>
  ) : (
    muiLink
  )
}

export default CaptionLink
