import {
  ArrowBackRounded,
  ArrowForwardRounded,
  CloseRounded,
} from '@mui/icons-material'
import { Box, ButtonBase, Dialog } from '@mui/material'
import { Media } from '../../types/Media'
import resolveSrcSetFromMediaSrcs from '../../utils/resolveSrcSetFromMediaSrcs'
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'

const NavButton = ({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) => (
  <ButtonBase
    onClick={onClick}
    sx={{
      display: 'block',
      height: '100%',
      pointerEvents: 'auto',
      width: '80px',
      '& .MuiSvgIcon-root': {
        color: theme =>
          theme.palette.getContrastText(theme.palette.action.active),
      },
    }}
  >
    {children}
  </ButtonBase>
)

interface Props {
  currentIndex: number | undefined
  media: Media[]
  onChange: (index: number) => void
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  open: boolean
}

const MediaFullscreenGallery = ({
  currentIndex = 0,
  media,
  onChange,
  onClose,
  onNext,
  onPrevious,
  open,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const scrollToSlide = (
    index: number,
    options: ScrollIntoViewOptions = {
      behavior: 'smooth',
    }
  ) => {
    const nextIndexNode = wrapperRef.current?.querySelector(
      `& > div:nth-child(${index + 1})`
    )

    nextIndexNode?.scrollIntoView(options)
  }

  useEffect(() => {
    if (!open && !visible) return
    scrollToSlide(currentIndex)
  }, [currentIndex, visible, open])

  useLayoutEffect(() => {
    // only run on open
    if (!open || visible) return

    const timeout = setTimeout(() => {
      scrollToSlide(currentIndex, { behavior: 'instant' })
      setVisible(true)
    }, 0)

    return () => {
      clearTimeout(timeout)
    }
  }, [visible, currentIndex, open])

  if (!open && visible) {
    setVisible(false)
  }

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        onNext()
      } else if (event.key === 'ArrowLeft') {
        onPrevious()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onNext, onPrevious, open])

  useEffect(() => {
    if (!open) return
    const wrapperRefCurrent = wrapperRef.current
    if (!wrapperRefCurrent) return

    const handleScroll = () => {
      const { scrollLeft, offsetWidth } = wrapperRefCurrent
      const newIndex = Math.round(scrollLeft / offsetWidth)
      if (scrollLeft % offsetWidth !== 0 || newIndex === currentIndex) return
      onChange(newIndex)
    }

    wrapperRef.current.addEventListener('scroll', handleScroll)

    return () => {
      wrapperRefCurrent.removeEventListener('scroll', handleScroll)
    }
  }, [currentIndex, onChange, open])

  return (
    <Dialog
      fullScreen
      open={open}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
        },
        '& .MuiDialog-paper': {
          backgroundColor: 'transparent',
        },
      }}
      onClose={onClose}
    >
      <Box
        sx={{
          display: 'grid',
          gridAutoColumns: '100%',
          gridAutoFlow: 'column',
          gridTemplateRows: '100%',
          height: '100%',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          width: '100%',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        ref={wrapperRef}
      >
        {media.map(mediaItem => (
          <Box
            key={mediaItem.id}
            sx={{
              height: '100%',
              width: '100%',
              scrollSnapAlign: 'center',
            }}
          >
            <picture style={{ display: 'contents' }}>
              <source
                srcSet={resolveSrcSetFromMediaSrcs(mediaItem.srcs)}
                type="image/webp"
              />
              <img
                alt=""
                height={mediaItem.height}
                sizes="100vw"
                src={mediaItem.src}
                style={{
                  display: 'block',
                  height: '100%',
                  objectFit: 'contain',
                  width: '100%',
                }}
                width={mediaItem.width}
              />
            </picture>
          </Box>
        ))}
      </Box>
      {media.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            height: '100%',
            justifyContent: 'space-between',
            left: 0,
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            width: '100%',
            '@media (hover: none)': {
              display: 'none',
            },
          }}
        >
          <NavButton onClick={onPrevious}>
            <ArrowBackRounded />
          </NavButton>
          <NavButton onClick={onNext}>
            <ArrowForwardRounded />
          </NavButton>
        </Box>
      )}
      <ButtonBase
        onClick={onClose}
        sx={{
          borderRadius: '50%',
          color: theme =>
            theme.palette.getContrastText(theme.palette.action.active),
          fontSize: '2rem',
          padding: 0.8,
          position: 'absolute',
          right: 10,
          top: 10,
          touchAction: 'none',
        }}
      >
        <CloseRounded />
      </ButtonBase>
    </Dialog>
  )
}

export default MediaFullscreenGallery
