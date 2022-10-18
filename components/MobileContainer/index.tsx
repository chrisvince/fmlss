import { Container } from '@mui/system'

interface PropTypes {
  children: React.ReactNode
}

const MobileContainer = ({ children }: PropTypes) => (
  <Container
    sx={{
      paddingLeft: {
        sm: 0,
      },
      paddingRight: {
        sm: 0,
      },
    }}
  >
    {children}
  </Container>
)

export default MobileContainer
