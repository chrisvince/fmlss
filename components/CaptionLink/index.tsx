import Link from 'next/link'
import { Link as MuiLink, Tooltip, TooltipProps } from '@mui/material'

interface PropTypes {
  children: React.ReactNode
  href: string
  tooltip?: string
  tooltipPlacement?: TooltipProps['placement']
}

const CaptionLink = ({
  children,
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
        color: 'text.secondary',
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
