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

  return (
    <Link href={href} passHref>
      {tooltip ? (
        <Tooltip placement={tooltipPlacement} title={tooltip}>
          {muiLink}
        </Tooltip>
      ) : (
        muiLink
      )}
    </Link>
  )
}

export default CaptionLink
