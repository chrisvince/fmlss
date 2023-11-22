import { PersonRounded } from '@mui/icons-material'
import { Tooltip } from '@mui/material'

const UserAuthoredIcon = () => (
  <Tooltip placement="top-start" title="Created by you. Only you can see this.">
    <PersonRounded
      sx={{
        fontSize: '1em',
      }}
      color="secondary"
    />
  </Tooltip>
)

export default UserAuthoredIcon
