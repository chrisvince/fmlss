import {
  NotificationsActiveRounded,
  NotificationsNoneRounded,
} from '@mui/icons-material'

import { ButtonBase, Tooltip } from '@mui/material'
import { useTheme, keyframes } from '@mui/system'

const ringKeyframe = keyframes`
  0%,
  30% {
    transform: rotate(20deg);
  }
  10% {
    transform: rotate(-20deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  70% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(0deg);
  }
`

interface PropTypes {
  onClick: () => unknown
  watching: boolean
}

const WatchButton = ({ onClick: handleClick, watching }: PropTypes) => {
  const theme = useTheme()

  return (
    <Tooltip placement="left" title="Get activity notifications">
      <ButtonBase
        aria-label={`Activity notifications. ${
          watching ? 'Enabled' : 'Disabled'
        }.`}
        sx={{
          borderRadius: '50%',
          fontSize: '1.05rem',
          margin: -0.6,
          padding: 0.6,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        onClick={handleClick}
      >
        {watching ? (
          <NotificationsActiveRounded
            fontSize="inherit"
            htmlColor={theme.palette.warning.main}
            sx={{
              transformOrigin: 'center 2.5px',
              animation: `${ringKeyframe} 0.8s 1`,
            }}
          />
        ) : (
          <NotificationsNoneRounded fontSize="inherit" color="action" />
        )}
      </ButtonBase>
    </Tooltip>
  )
}

export default WatchButton
