import { PersonRounded } from '@mui/icons-material'
import { Tooltip } from '@mui/material'

const UserAuthoredIcon = () => (
  <Tooltip
    placement="top-start"
    title="This post was created by you. Only you can see this."
  >
    <PersonRounded
      sx={{
        fontSize: '1em',
        marginRight: 0.8,
      }}
      color="secondary"
    />
  </Tooltip>
)

export default UserAuthoredIcon
