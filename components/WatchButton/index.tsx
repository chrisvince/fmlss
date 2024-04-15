import {
  NotificationsActiveRounded,
  NotificationsNoneRounded,
} from '@mui/icons-material'

import { ButtonBase, Tooltip } from '@mui/material'
import { useTheme, keyframes } from '@mui/system'
import { useRef } from 'react'

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

const WatchButton = ({ onClick: handleClick, watching = false }: PropTypes) => {
  const theme = useTheme()
  const watchingChangedFromInitial = useRef(false)
  const initialWatching = useRef(watching)
  const enableAnimation = useRef(false)

  if (
    !watchingChangedFromInitial.current &&
    initialWatching.current !== watching
  ) {
    enableAnimation.current = true
  }

  return (
    <Tooltip
      placement="left"
      title="Get notified when people respond to this post"
    >
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
              animation: enableAnimation.current
                ? `${ringKeyframe} 0.8s 1`
                : undefined,
              transformOrigin: 'center 2.5px',
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
