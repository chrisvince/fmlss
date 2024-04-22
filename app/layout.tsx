import constants from '../constants'

const { BRAND_NAME } = constants

export const metadata = {
  title: BRAND_NAME,
  description: 'The anonymous network',
}

interface Props {
  children: React.ReactNode
}

export const RootLayout = ({ children }: Props) => (
  <html lang="en">
    <body>{children}</body>
  </html>
)
