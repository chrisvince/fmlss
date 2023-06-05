import {
  NotificationsActiveRounded,
  NotificationsNoneRounded,
} from '@mui/icons-material'

import { ButtonBase, Tooltip } from '@mui/material'
import { useTheme } from '@mui/system'

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
          />
        ) : (
          <NotificationsNoneRounded fontSize="inherit" color="action" />
        )}
      </ButtonBase>
    </Tooltip>
  )
}

export default WatchButton
