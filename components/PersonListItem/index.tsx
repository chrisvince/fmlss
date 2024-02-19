import { Typography } from '@mui/material'
import { Box } from '@mui/system'

import formatPostCount from '../../utils/formatting/formatPostCount'
import ListItemFrame from '../ListItemFrame'
import { ElementType } from 'react'
import { Person } from '../../types/Person'

type PropTypes = {
  component?: ElementType<any> & (ElementType<any> | undefined)
  person: Person
}

const PersonListItem = ({ component, person }: PropTypes) => {
  const postCount = formatPostCount(person.data.postCount)

  return (
    <ListItemFrame component={component} href={`/people/${person.data.slug}`}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography component="div" variant="body1">
          {person.data.name}
        </Typography>
        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="caption" component="div" align="right">
            {postCount}
          </Typography>
        </Box>
      </Box>
    </ListItemFrame>
  )
}

export default PersonListItem
