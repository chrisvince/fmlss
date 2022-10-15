import { Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import Page from '../Page'
import CreateUsernameForm from '../CreateUsernameForm'

const CreateUsernamePage = () => {
  return (
    <Page
      description="Create a Fameless username."
      pageTitle="Create a username"
      layout="none"
      noPageTitle
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: 2,
          }}
        >
          <Typography variant="body1" component="h1">
            Choose a username
          </Typography>
          <CreateUsernameForm />
        </Box>
      </Container>
    </Page>
  )
}

export default CreateUsernamePage
