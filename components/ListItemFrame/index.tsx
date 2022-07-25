import { Box } from '@mui/system'
import { SyntheticEvent, useState } from 'react'

interface PropTypes {
  'aria-label'?: string
  'aria-labelledby'?: string
  children: React.ReactNode
  component?: React.ElementType
  mini?: boolean
  onOpen?: () => void
}

const ListItemFrame = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  component,
  mini = false,
  onOpen,
}: PropTypes) => {
  const [highlight, setHighlight] = useState(false)

  const handleClick = (event: SyntheticEvent) => {
    const isClickableElement = (event.target as HTMLAnchorElement).closest(
      'a, button'
    )
    if (isClickableElement) return
    if (window.getSelection()?.toString().length) return
    setHighlight(true)
    onOpen?.()
  }

  return (
    <Box
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      component={component}
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        borderBottom: '1px solid',
        borderColor: 'divider',
        paddingX: mini ? 1 : 2,
        paddingY: mini ? 1 : 2,
        transition: 'ease-in-out 200ms',
        transitionProperty: 'background-color',
        backgroundColor: highlight ? 'action.hover' : undefined,
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        },
      }}
    >
      {children}
    </Box>
  )
}

export default ListItemFrame
