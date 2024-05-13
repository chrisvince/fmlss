import { Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import Brand from '../Brand'
import Page from '../Page'
import SignUpForm from '../SignUpForm'

const WelcomePage = () => (
  <Page
    description="Join the conversation. Join Fameless."
    layout="none"
    pageTitle="Sign in or create an account"
  >
    <Container
      sx={{
        maxWidth: theme => {
          return [
            theme.breakpoints.values.sm,
            undefined,
            theme.breakpoints.values.lg,
          ]
        },
        px: {
          md: 8,
        },
      }}
    >
      <Box
        sx={{
          alignItems: {
            md: 'center',
          },
          columnGap: {
            md: 8,
          },
          display: {
            md: 'grid',
          },
          gridTemplateColumns: {
            md: '1fr 400px',
          },
        }}
      >
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            justifyContent: 'flex-start',
            my: [16, undefined, 0],
          }}
        >
          <Brand height={34} width={210} />
          <Typography component="h2" sx={{ lineHeight: 1.1 }} variant="h4">
            The uncensored,
            <br />
            anonymous network.
          </Typography>
        </Box>
        <SignUpForm />
      </Box>
    </Container>
  </Page>
)

export default WelcomePage
