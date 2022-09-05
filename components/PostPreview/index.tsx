import { CloseRounded } from '@mui/icons-material'
import { ButtonBase, Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent, useEffect, useState } from 'react'
import { PostPreview as PostPreviewType } from '../../types'

import truncateString from '../../utils/truncateString'

const IMAGE_SMALL_SIZE: number = 80

interface GetLayoutFromImageDimensions {
  height?: number
  width?: number
}

const getIsLandscape = (width: number, height: number) =>
  width > 599 && height <= (width / 3) * 2

const getLayoutFromImageDimensions = ({
  height,
  width,
}: GetLayoutFromImageDimensions = {}) => {
  if (!height || !width) {
    return 'text'
  }

  if (getIsLandscape(width, height)) {
    return 'imageLarge'
  }
  return 'imageSmall'
}

interface ImageNaturalDimensions {
  width: number
  height: number
}

interface Props {
  onClose?: (href: string) => void
  onLoad?: () => void
  postPreview: PostPreviewType
}

const PostPreview = ({ onClose, onLoad, postPreview }: Props) => {
  const { description, href, image, subtitle, title } = postPreview

  const [imageNaturalDimensions, setImageNaturalDimensions] =
    useState<ImageNaturalDimensions>()

  const [imageLoadFailed, setImageLoadFailed] = useState<boolean>(false)

  const handleClick = (event: SyntheticEvent) => {
    const isClickableElement = (event.target as HTMLAnchorElement).closest(
      'button'
    )
    if (!isClickableElement) return
    event.preventDefault()
  }

  const handleClose = () => onClose?.(href)

  useEffect(() => {
    if (!image?.src) return
    const imageNode = new Image()
    imageNode.src = image.src
    imageNode.onload = ({ currentTarget }) => {
      setImageNaturalDimensions({
        // @ts-ignore
        width: currentTarget!.naturalWidth,
        // @ts-ignore
        height: currentTarget!.naturalHeight,
      })
      onLoad?.()
    }
    imageNode.onerror = () => {
      setImageLoadFailed(true)
      onLoad?.()
    }
  }, [image, onLoad])

  if (image?.src && !imageNaturalDimensions && !imageLoadFailed) {
    return null
  }

  const layout = getLayoutFromImageDimensions(imageNaturalDimensions)
  const isImageLayout = layout === 'imageSmall' || layout === 'imageLarge'
  const isImageLargeLayout = layout === 'imageLarge'

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener"
      underline="none"
      onClick={handleClick}
      sx={{
        position: 'relative',
        display: 'block',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mt: 2,
        px: 1.5,
        py: 1,
        transition: 'ease-in-out 200ms',
        transitionProperty: 'background-color',
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: 'action.hover',
            '.MuiButtonBase-root': {
              opacity: 1,
            },
          },
        },
      }}
    >
      {onClose && (
        <ButtonBase
          onClick={handleClose}
          aria-label="Close"
          sx={{
            opacity: 0,
            position: 'absolute',
            top: '-12px',
            right: '-12px',
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
              '&:hover': {
                backgroundColor: 'grey.200',
              },
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: {
            text: '"text"',
            imageSmall: '"image text"',
            imageLarge: '"image" "text"',
          }[layout],
          gridTemplateColumns: {
            text: '1fr',
            imageSmall: `${IMAGE_SMALL_SIZE}px 1fr`,
            imageLarge: `1fr`,
          }[layout],
          gridTemplateRows: {
            text: '1fr',
            imageSmall: `minmax(${IMAGE_SMALL_SIZE}px, 1fr)`,
            imageLarge: 'auto 1fr',
          }[layout],
          gap: 2,
        }}
      >
        {isImageLayout && (
          <Box
            sx={{
              gridArea: 'image',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={image!.src}
              alt={title}
              sx={{
                maxHeight: isImageLargeLayout
                  ? undefined
                  : `${IMAGE_SMALL_SIZE}px`,
                maxWidth: isImageLargeLayout
                  ? undefined
                  : `${IMAGE_SMALL_SIZE}px`,
                width: isImageLargeLayout ? '100%' : undefined,
                objectFit: 'contain',
              }}
            />
          </Box>
        )}
        <Box
          sx={{
            gridArea: 'text',
            alignSelf: 'center',
          }}
        >
          <Typography variant="caption" component="div">
            {title ?? href}
          </Typography>
          {subtitle && (
            <Typography variant="caption" component="div">
              {subtitle}
            </Typography>
          )}
          {description && (
            <Typography
              variant="caption"
              component="p"
              sx={{ color: 'text.secondary' }}
            >
              {truncateString(description, 220)}
            </Typography>
          )}
        </Box>
      </Box>
    </Link>
  )
}

export default PostPreview
