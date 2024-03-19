import { Box, Button, SvgIconTypeMap, Typography } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import Link from 'next/link'
import { ForwardedRef, forwardRef, useId } from 'react'
import formatCount from '../../utils/formatting/formatCount'

type Icon = OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
  muiName: string
}

interface PropTypes {
  active?: boolean
  activeIcon?: Icon
  count?: number
  href?: string
  icon: Icon | (() => JSX.Element)
  onClick?: () => void
  rotateIcon?: number
  text: string | number
  textColor?: string
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
    count,
    href,
    icon: Icon,
    onClick,
    rotateIcon,
    text,
    textColor,
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
      <Box
        sx={{
          alignItems: 'baseline',
          display: 'flex',
          gap: 0.5,
        }}
      >
        <Typography
          id={labelledById}
          sx={{ color: textColor ?? 'text.primary' }}
          variant="caption"
        >
          {text}
        </Typography>
        {!!count && count > 0 && (
          <Typography
            sx={{
              color: textColor ?? 'text.primary',
              fontWeight: 600,
            }}
            variant="caption"
          >
            {formatCount(count)}
          </Typography>
        )}
      </Box>
    </Button>
  )
}

export default forwardRef(ActionButton)
