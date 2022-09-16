import { CloseRounded } from '@mui/icons-material'
import { ButtonBase, Link, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import NextImage from 'next/image'
import { SyntheticEvent, useEffect, useState } from 'react'
import { PostPreview as PostPreviewType } from '../../types'

import truncateString from '../../utils/truncateString'

const IMAGE_SMALL_SIZE: number = 80
const IMAGE_TRANSITION = 'ease-in 200ms'

const getIsLandscape = (width: number, height: number) =>
  width > 599 && height <= (width / 3) * 2

const getLayoutFromImageDimensions = (
  width: number | undefined,
  height: number | undefined,
) => {
  if (!height || !width) {
    return 'text'
  }

  if (getIsLandscape(width, height)) {
    return 'imageLarge'
  }
  return 'imageSmall'
}

interface ImageDimensionsState {
  width: number
  height: number
}

interface Props {
  onClose?: (postPreview: PostPreviewType) => void
  postPreview: PostPreviewType
}

const PostPreview = ({ onClose, postPreview }: Props) => {
  const { description, href, image, subtitle, title } = postPreview
  const [dynamicImage, setDynamicImage] = useState<ImageDimensionsState>()
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)
  const { palette } = useTheme()

  const handleClick = (event: SyntheticEvent) => {
    const isClickableElement = (event.target as HTMLAnchorElement).closest(
      'button'
    )
    if (!isClickableElement) return
    event.preventDefault()
  }

  const handleClose = () => onClose?.(postPreview)

  useEffect(() => {
    if (!image || (image.width && image.height)) return
    const imageNode = new Image()
    imageNode.src = image.src
    imageNode.onload = ({ currentTarget }) => {
      setDynamicImage({
        // @ts-ignore
        width: currentTarget!.naturalWidth,
        // @ts-ignore
        height: currentTarget!.naturalHeight,
      })
    }
  }, [image])

  if ((!image?.width && !image?.height) && !dynamicImage) {
    return null
  }

  const width = image?.width ?? dynamicImage?.width
  const height = image?.height ?? dynamicImage?.height
  const layout = getLayoutFromImageDimensions(width, height)
  const isImageLayout = layout === 'imageSmall' || layout === 'imageLarge'
  const isImageLargeLayout = layout === 'imageLarge'

  const imageStyle = {
    maxHeight: isImageLargeLayout ? undefined : `${IMAGE_SMALL_SIZE}px`,
    maxWidth: isImageLargeLayout ? '100%' : `${IMAGE_SMALL_SIZE}px`,
    width: isImageLargeLayout ? '100%' : undefined,
  }

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
        py: 1.5,
        transition: 'ease-in-out 200ms',
        transitionProperty: 'background-color',
        '@media (hover: none)': {
          '.MuiButtonBase-root': {
            opacity: 1,
          },
        },
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
              '@media (hover: none)': {
                backgroundColor: 'grey.200',
              },
              '@media (hover: hover)': {
                '&:hover': {
                  backgroundColor: 'grey.200',
                },
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
            imageLarge: '100%',
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
          <Box sx={{ gridArea: 'image' }}>
            {dynamicImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image!.src}
                alt={image!.alt}
                style={imageStyle}
              />
            ) : (
              <Box
                sx={{
                  backgroundColor: !imageLoaded && palette.action.hover,
                  transition: `background-color ${IMAGE_TRANSITION}`,
                }}
              >
                <NextImage
                  src={image!.src}
                  alt={image!.alt}
                  width={width}
                  height={height}
                  layout="responsive"
                  objectFit="contain"
                  style={{
                    ...imageStyle,
                    opacity: imageLoaded ? 1 : 0,
                    transition: `opacity ${IMAGE_TRANSITION}`,
                  }}
                  onLoadingComplete={() => setImageLoaded(true)}
                />
              </Box>
            )}
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
