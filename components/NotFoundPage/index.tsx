import { Typography } from "@mui/material"
import { Box } from "@mui/system"
import MiniCategoriesSection from "../MiniCategoriesSection"
import MiniHashtagsSection from "../MiniHashtagsSection"
import Page from "../Page"
import TextAndCta from "../TextAndCta"

const NotFoundPage = () => (
  <Page
    pageTitle="Not found"
    noPageTitle
    rightPanelChildren={
      <>
        <MiniHashtagsSection />
        <MiniCategoriesSection />
      </>
    }
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
      >
        We couldn&apos;t find that page. 🤔
      </Typography>
      <TextAndCta
        ctaHref="/"
        ctaText="Go back home"
        message="It looks like the page you're looking for doesn't exist. Click below to go back home."
      />
    </Box>
  </Page>
)

export default NotFoundPage
