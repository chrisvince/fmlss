import { Box, useTheme } from '@mui/system'
import MapLineSegment from '../MapLineSegment'
import type { MapLineSegment as MapLineSegmentType } from '../MapLineSegment'
import { ReactNode } from 'react'
import constants from '../../constants'

const { NESTED_POST_MARGIN_LEFT } = constants

type Props = MapLineSegmentType & {
  children: ReactNode
  hideLine?: boolean
}

const MapLinePostItemLayout = ({
  children,
  dotPosition,
  hideLine = false,
  lineType,
}: Props) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `${theme.spacing(NESTED_POST_MARGIN_LEFT)} 1fr`,
      }}
    >
      <Box>
        {!hideLine && (
          <MapLineSegment dotPosition={dotPosition} lineType={lineType} />
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

export default MapLinePostItemLayout
