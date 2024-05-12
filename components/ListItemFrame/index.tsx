import { Box } from '@mui/system'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface PropTypes {
  'aria-label'?: string
  'aria-labelledby'?: string
  children: React.ReactNode
  href: string
  isLink?: boolean
  isSidebar?: boolean
}

const ListItemFrame = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  href,
  isLink = false,
  isSidebar = false,
}: PropTypes) => {
  const [highlight, setHighlight] = useState(false)
  const { asPath, prefetch, push: navigate } = useRouter()
  const [ref, inView] = useInView({ triggerOnce: true })

  const handleClick = (event: SyntheticEvent) => {
    if (href === asPath) return

    if (isLink) {
      setHighlight(true)
      return
    }

    const isClickableElement = (event.target as HTMLAnchorElement).closest(
      'a, button, [role="presentation"], mux-player'
    )
    if (isClickableElement) return
    if (window.getSelection()?.toString().length) return
    setHighlight(true)
    navigate(href)
  }

  useEffect(() => {
    if (!inView || isLink) return
    prefetch(href)
  }, [href, inView, isLink, prefetch])

  return (
    <Box
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      component={isLink ? Link : 'article'}
      onClick={handleClick}
      ref={ref}
      href={isLink ? href : undefined}
      sx={{
        backgroundColor: highlight ? 'action.hover' : undefined,
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        cursor: 'pointer',
        display: 'block',
        padding: isSidebar ? 1 : 2,
        transition: 'ease-in-out 200ms',
        transitionProperty: 'background-color',
        textDecoration: 'none',
        color: 'inherit',
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
