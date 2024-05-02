import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import SidebarTopicsSection from '../SidebarTopicsSection'
import SidebarHashtagsSection from '../SidebarHashtagsSection'
import Page from '../Page'
import TextAndCta from '../TextAndCta'
import constants from '../../constants'
import MobileContainer from '../MobileContainer'
import SidebarPeopleSection from '../SidebarPeopleSection'

const { TOPICS_ENABLED } = constants

const NotFoundPage = () => (
  <Page
    pageTitle="Not found"
    rightPanelChildren={
      <>
        <SidebarPeopleSection />
        {TOPICS_ENABLED && <SidebarTopicsSection />}
        <SidebarHashtagsSection />
      </>
    }
  >
    <MobileContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ lineHeight: [undefined, '0.8em'] }}
        >
          We couldn&apos;t find that page. 🤔
        </Typography>
        <TextAndCta
          ctaHref="/"
          ctaText="Go home"
          message="It looks like the page you're looking for doesn't exist."
        />
      </Box>
    </MobileContainer>
  </Page>
)

export default NotFoundPage
