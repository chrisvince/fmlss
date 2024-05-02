import { ReactElement } from 'react'
import LayoutBasicBranded from '../components/LayoutBasicBranded'
import { Box, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import { get as getEdgeConfig } from '@vercel/edge-config'
import { MaintenaceConfig } from '../types/MaintenanceConfig'

const MESSAGE_DEFAULT =
  "We're working on making our site better so you can have an even better experience. Sit tight and we&apos;ll be back before you know it."

const TITLE_DEFAULT = "We're making some changes!"

interface Props {
  message: string
  title: string
}

const Maintenance = ({
  message = MESSAGE_DEFAULT,
  title = TITLE_DEFAULT,
}: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',

        gap: 4,
      }}
    >
      <Typography variant="h4" component="h1" sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      <Typography
        sx={{ textAlign: 'center', lineHeight: 1.75 }}
        variant="body1"
        component="p"
      >
        {message}
      </Typography>
      <Typography sx={{ textAlign: 'center' }} variant="h5" component="p">
        See you real soon!
      </Typography>
    </Box>
  )
}

Maintenance.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutBasicBranded containerProps={{ maxWidth: 'sm' }}>
      {page}
    </LayoutBasicBranded>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const maintenanceModeConfig = (await getEdgeConfig('maintenance_mode')) as
    | MaintenaceConfig
    | undefined

  if (!maintenanceModeConfig?.enabled) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      message: maintenanceModeConfig.message,
      title: maintenanceModeConfig.title,
    },
  }
}

export default Maintenance
