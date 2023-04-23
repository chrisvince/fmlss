import { Box, SxProps } from '@mui/system'

export interface MapLineSegment {
  lineType: 'collapsed' | 'end' | 'middle' | 'start'
  dotPosition?: 'top' | 'center'
}

const COLOR = 'grey.200'
const TOP_PADDING = '21px'
const LINE_WIDTH = '2px'

const DOT_SIZE_PX = 10
const DOT_SIZE = `${DOT_SIZE_PX}px`
const DOT_SIZE_HALF = `${DOT_SIZE_PX / 2}px`

interface DotProps {
  rounded?: boolean
  sx?: SxProps
}

const Dot = ({ sx = {} }: DotProps) => (
  <Box
    sx={{
      backgroundColor: COLOR,
      borderRadius: '50%',
      height: DOT_SIZE,
      width: DOT_SIZE,
      ...sx,
    }}
  />
)

interface LineProps {
  rounded?: 'both' | 'bottom' | 'top'
  sx?: SxProps
}

const Line = ({ rounded, sx = {} }: LineProps) => (
  <Box
    sx={{
      backgroundColor: COLOR,
      borderRadius: rounded
        ? {
            both: '50px',
            bottom: '0 0 50px 50px',
            top: '50px 50px 0 0',
          }[rounded]
        : undefined,
      height: '100%',
      width: LINE_WIDTH,
      ...sx,
    }}
  />
)

const SX_CONSTANTS: SxProps = {
  display: 'grid',
  height: '100%',
  justifyItems: 'center',
}

const MapLineSegment = ({ lineType, dotPosition }: MapLineSegment) => {
  if (lineType === 'start' && dotPosition === 'top') {
    return (
      <Box
        sx={{
          ...SX_CONSTANTS,
          gridTemplateRows: `${DOT_SIZE_HALF} ${DOT_SIZE_HALF} 1fr`,
          pt: TOP_PADDING,
        }}
      >
        <Dot sx={{ gridRow: '1 / 3', gridColumn: '1 / 2' }} />
        <Line sx={{ gridRow: '2 / 4', gridColumn: '1 / 2' }} />
      </Box>
    )
  }

  if (lineType === 'start' && dotPosition === 'center') {
    return (
      <Box
        sx={{
          ...SX_CONSTANTS,
          gridTemplateRows: `1fr ${DOT_SIZE_HALF} ${DOT_SIZE_HALF} 1fr`,
        }}
      >
        <Dot sx={{ gridRow: '2 / 4', gridColumn: '1 / 2' }} />
        <Line sx={{ gridRow: '3 / 5', gridColumn: '1 / 2' }} />
      </Box>
    )
  }

  if (lineType === 'middle' && dotPosition === 'top') {
    return (
      <Box
        sx={{
          ...SX_CONSTANTS,
          gridTemplateRows: `${TOP_PADDING} ${DOT_SIZE_HALF} ${DOT_SIZE_HALF} 1fr`,
        }}
      >
        <Line sx={{ gridRow: '1 / 3', gridColumn: '1 / 2' }} />
        <Dot sx={{ gridRow: '2 / 4', gridColumn: '1 / 2' }} />
        <Line sx={{ gridRow: '3 / 5', gridColumn: '1 / 2' }} />
      </Box>
    )
  }

  if (lineType === 'middle' && dotPosition === 'center') {
    return (
      <Box
        sx={{
          ...SX_CONSTANTS,
          gridTemplateRows: `1fr ${DOT_SIZE_HALF} ${DOT_SIZE_HALF} 1fr`,
        }}
      >
        <Line sx={{ gridRow: '1 / 3', gridColumn: '1 / 2' }} />
        <Dot sx={{ gridRow: '2 / 4', gridColumn: '1 / 2' }} />
        <Line sx={{ gridRow: '3 / 5', gridColumn: '1 / 2' }} />
      </Box>
    )
  }

  if (lineType === 'middle') {
    return (
      <Box
        sx={{
          ...SX_CONSTANTS,
          gridTemplateRows: '1fr',
        }}
      >
        <Line sx={{ gridRow: '1 / 2', gridColumn: '1 / 2' }} />
      </Box>
    )
  }

  if (lineType === 'end') {
    return (
      <Box
        sx={{
          ...SX_CONSTANTS,
          gridTemplateRows: `${TOP_PADDING} ${DOT_SIZE_HALF} ${DOT_SIZE_HALF} 1fr`,
        }}
      >
        <Line sx={{ gridRow: '1 / 3', gridColumn: '1 / 2' }} />
        <Dot sx={{ gridRow: '2 / 4', gridColumn: '1 / 2' }} />
      </Box>
    )
  }

  if (lineType === 'collapsed') {
    return (
      <Box
        sx={{
          ...SX_CONSTANTS,
          gridTemplateRows: '1px 1fr 1fr 1fr 1px',
          rowGap: '3px',
        }}
      >
        <Line rounded="bottom" />
        <Line rounded="both" />
        <Line rounded="both" />
        <Line rounded="both" />
        <Line rounded="top" />
      </Box>
    )
  }

  return null
}

export default MapLineSegment
