import { useMediaQuery } from '@mui/material'
import { Container, useTheme } from '@mui/system'

interface PropTypes {
  children: React.ReactNode
}

const MobileContainer = ({ children }: PropTypes) => {
  const theme = useTheme()
  const disableGutters = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Container disableGutters={disableGutters}>
      {children}
    </Container>
  )
}

export default MobileContainer
