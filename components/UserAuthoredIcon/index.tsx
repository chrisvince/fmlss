import { PersonRounded } from '@mui/icons-material'
import { Tooltip } from '@mui/material'

const UserAuthoredIcon = () => (
  <Tooltip placement="top-start" title="Posted by you. Only you can see this.">
    <PersonRounded
      sx={{
        fontSize: '0.9em',
      }}
      color="secondary"
    />
  </Tooltip>
)

export default UserAuthoredIcon
