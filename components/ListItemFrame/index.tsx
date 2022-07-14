import { Box } from '@mui/system'
import { SyntheticEvent } from 'react'

interface PropTypes {
  'aria-label'?: string
  children: React.ReactNode
  component?: React.ElementType
  mini?: boolean
  onOpen?: () => void
}

const IGNORE_NAVIGATE_TAG_NAMES = ['A', 'BUTTON']

const ListItemFrame = ({
  'aria-label': ariaLabel,
  children,
  component,
  mini = false,
  onOpen,
}: PropTypes) => {
  const handleClick = (event: SyntheticEvent) => {
    const { tagName } = event.target as HTMLAnchorElement
    if (IGNORE_NAVIGATE_TAG_NAMES.includes(tagName)) return
    if (window.getSelection()?.toString().length) return
    onOpen?.()
  }

  return (
    <Box
      aria-label={ariaLabel}
      component={component}
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        borderBottom: '1px solid',
        borderColor: 'divider',
        paddingX: mini ? 1 : 2,
        paddingY: mini ? 1 : 4,
        transition: 'ease-in-out 200ms',
        transitionProperty: 'background-color',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      {children}
    </Box>
  )
}

export default ListItemFrame
