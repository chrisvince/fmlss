import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface PropTypes {
  'aria-label'?: string
  'aria-labelledby'?: string
  children: React.ReactNode
  component?: React.ElementType
  href: string
  mini?: boolean
}

const ListItemFrame = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  component,
  href,
  mini = false,
}: PropTypes) => {
  const [highlight, setHighlight] = useState(false)
  const { prefetch, push: navigate } = useRouter()
  const [ref, inView] = useInView({ triggerOnce: true })

  const handleClick = (event: SyntheticEvent) => {
    const isClickableElement = (event.target as HTMLAnchorElement).closest(
      'a, button, [role="presentation"]',
    )
    if (isClickableElement) return
    if (window.getSelection()?.toString().length) return
    setHighlight(true)
    if (!href) return
    navigate(href)
  }

  useEffect(() => {
    if (!inView) return
    prefetch(href)
  }, [href, inView, prefetch])

  return (
    <Box
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      component={component}
      onClick={handleClick}
      ref={ref}
      sx={{
        cursor: 'pointer',
        borderBottom: '1px solid',
        borderColor: 'divider',
        padding: mini ? 1 : 2,
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
