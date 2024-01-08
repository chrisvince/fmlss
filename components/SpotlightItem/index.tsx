import { Box, useTheme } from '@mui/material'
import { type SpotlightElement } from '../../contexts/SpotlightContext'
import useSpotlightItem from '../../utils/useSpotlightItem'

interface Props {
  children: React.ReactNode
  paddingX?: number
  paddingY?: number
  spotlightItem: SpotlightElement
}

const SpotlightItem = ({
  children,
  paddingX,
  paddingY,
  spotlightItem,
}: Props) => {
  const { isSpotlight } = useSpotlightItem(spotlightItem)
  const theme = useTheme()

  return (
    <Box
      sx={
        isSpotlight
          ? {
              backgroundColor: theme.palette.background.paper,
              position: 'relative',
              zIndex: theme.zIndex.modal + 2,
              pointerEvents: 'none',
              ...(paddingX ? { px: paddingX, mx: -paddingX } : {}),
              ...(paddingY ? { py: paddingY, my: -paddingY } : {}),
            }
          : undefined
      }
    >
      {children}
    </Box>
  )
}

export default SpotlightItem
