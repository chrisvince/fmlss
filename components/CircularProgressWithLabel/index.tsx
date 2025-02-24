import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from '@mui/material'

const CircularProgressWithLabel = ({
  fontSize,
  percentage,
  variant = 'determinate',
  ...restProps
}: CircularProgressProps & { percentage: number; fontSize?: number }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress value={percentage} variant={variant} {...restProps} />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="caption"
        component="div"
        color="text.secondary"
        fontSize={fontSize}
      >
        {`${Math.round(percentage)}%`}
      </Typography>
    </Box>
  </Box>
)

export default CircularProgressWithLabel
