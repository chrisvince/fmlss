import { CloseRounded } from '@mui/icons-material'
import { ButtonBase } from '@mui/material'
import { Box } from '@mui/system'

interface Props {
  children: React.ReactNode
  disabled?: boolean
  onClose?: () => void
}

const CloseButtonWrapper = ({ children, disabled = false, onClose }: Props) => (
  <Box
    sx={{
      position: 'relative',
      display: 'block',
      marginBlockStart: 2,
      '@media (hover: none)': {
        '.MuiButtonBase-root': {
          opacity: 1,
        },
      },
      '@media (hover: hover)': {
        '&:hover': {
          '.MuiButtonBase-root': {
            opacity: 1,
          },
        },
      },
    }}
  >
    {!disabled && (
      <ButtonBase
        onClick={onClose}
        aria-label="Close"
        sx={{
          opacity: 0,
          zIndex: 1,
          position: 'absolute',
          top: '-12px',
          right: '-12px',
          '@media (hover: none)': {
            '.MuiBox-root': {
              backgroundColor: 'grey.200',
            },
          },
          '@media (hover: hover)': {
            '&:hover': {
              '.MuiBox-root': {
                backgroundColor: 'grey.200',
              },
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            backgroundColor: 'grey.300',
            padding: 0.4,
          }}
        >
          <CloseRounded
            sx={{
              height: '16px',
              width: '16px',
            }}
          />
        </Box>
      </ButtonBase>
    )}
    <Box sx={{ display: 'flex', height: '100%' }}>{children}</Box>
  </Box>
)

export default CloseButtonWrapper
