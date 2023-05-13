import { Button, SvgIconTypeMap, Typography } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import Link from 'next/link'
import { ForwardedRef, forwardRef, useId } from 'react'

type Icon = OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
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

const ActionButton = (
  {
    active,
    activeColor,
    activeIcon: ActiveIcon,
    href,
    icon: Icon,
    onClick,
    text,
    rotateIcon,
  }: PropTypes,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  const labelledById = useId()

  return (
    <Button
      aria-labelledby={labelledById}
      component={href ? Link : 'button'}
      href={href}
      onClick={onClick}
      ref={ref}
      size="small"
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
      <Typography
        id={labelledById}
        sx={{ color: 'text.primary' }}
        variant="caption"
      >
        {text}
      </Typography>
    </Button>
  )
}

export default forwardRef(ActionButton)
