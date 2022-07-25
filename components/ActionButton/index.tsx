import { Button, SvgIconTypeMap, Typography } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import Link from 'next/link'
import { useId } from 'react'

type Icon = OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
  muiName: string
}

interface PropTypes {
  icon: Icon
  href?: string
  onClick?: () => void
  text: string | number
  active?: boolean
  activeIcon?: Icon
  rotateIcon?: number
  activeColor?:
    | 'action'
    | 'disabled'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | undefined
}

const ActionButton = ({
  active,
  activeColor,
  activeIcon: ActiveIcon,
  href,
  icon: Icon,
  onClick,
  text,
  rotateIcon,
}: PropTypes) => {
  const labelledById = useId()

  const button = (
    <Button
      aria-labelledby={labelledById}
      size="small"
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.8,
        textTransform: 'none',
        px: 1,
        py: 0.6,
      }}
    >
      {active && ActiveIcon ? (
        <ActiveIcon
          sx={{
            transform: rotateIcon ? `rotate(${rotateIcon}deg)` : undefined,
          }}
          color={activeColor}
          fontSize="small"
        />
      ) : (
        <Icon
          sx={{
            transform: rotateIcon ? `rotate(${rotateIcon}deg)` : undefined,
          }}
          color={active ? activeColor : 'action'}
          fontSize="small"
        />
      )}
      <Typography variant="caption" id={labelledById}>
        {text}
      </Typography>
    </Button>
  )

  if (href) {
    return (
      <Link href={href} passHref>
        {button}
      </Link>
    )
  }

  return button
}

export default ActionButton
