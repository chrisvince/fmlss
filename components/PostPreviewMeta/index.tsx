import { CloseRounded } from '@mui/icons-material'
import { ButtonBase, Link, Typography } from '@mui/material'
import { Box, useTheme } from '@mui/system'
import NextImage from 'next/image'
import { SyntheticEvent, useEffect, useState } from 'react'
import { PostPreviewMeta as PostPreviewMetaType } from '../../types'

import truncateString from '../../utils/truncateString'
import CloseButtonWrapper from '../CloseButtonWrapper'

const IMAGE_SMALL_SIZE = 80
const IMAGE_TRANSITION = 'ease-in 200ms'

const getIsLandscape = (width: number, height: number) =>
  width > 599 && height <= (width / 3) * 2

const getLayoutFromImageDimensions = (
  width: number | undefined,
  height: number | undefined
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
  isAboveFold?: boolean
  onClose?: () => void
  postPreview: PostPreviewMetaType
}

const PostPreviewMeta = ({ isAboveFold, onClose, postPreview }: Props) => {
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

  useEffect(() => {
    if (!image || (image.width && image.height)) return
    const imageNode = new Image()
    imageNode.src = image.src
    imageNode.onload = ({ currentTarget }) => {
      setDynamicImage({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        width: currentTarget!.naturalWidth,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        height: currentTarget!.naturalHeight,
      })
    }
  }, [image])

  if (!image?.width && !image?.height && !dynamicImage) {
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
    <Box
      sx={{
        '@media (hover: hover)': {
          '&:hover': {
            '.MuiLink-root': {
              backgroundColor: 'action.hover',
            },
          },
        },
      }}
    >
      <CloseButtonWrapper onClose={onClose}>
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
            px: 1.5,
            py: 1.5,
            transition: 'ease-in-out 200ms',
            transitionProperty: 'background-color',
          }}
        >
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
            {isImageLayout && image && (
              <Box sx={{ gridArea: 'image' }}>
                {dynamicImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.src} alt={image.alt} style={imageStyle} />
                ) : (
                  <Box
                    sx={{
                      backgroundColor: !imageLoaded && palette.action.hover,
                      transition: `background-color ${IMAGE_TRANSITION}`,
                    }}
                  >
                    <Box
                      sx={{
                        aspectRatio: `${width}/${height}`,
                        position: 'relative',
                      }}
                    >
                      <NextImage
                        alt={image.alt}
                        fill
                        onLoadingComplete={() => setImageLoaded(true)}
                        priority={isAboveFold}
                        sizes={`
                          (min-width: 1340px) 522px,
                          (min-width: 900px) 38vw,
                          (min-width: 600px) 60vw,
                          90vw"
                        `}
                        src={image.src}
                        style={{
                          opacity: imageLoaded ? 1 : 0,
                          transition: `opacity ${IMAGE_TRANSITION}`,
                        }}
                      />
                    </Box>
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
              <Typography
                component="div"
                sx={{ wordBreak: 'break-word' }}
                variant="caption"
              >
                {title ?? href}
              </Typography>
              {subtitle && subtitle !== (title ?? href) && (
                <Typography
                  component="div"
                  sx={{ wordBreak: 'break-word' }}
                  variant="caption"
                >
                  {subtitle}
                </Typography>
              )}
              {description && (
                <Typography
                  variant="caption"
                  component="p"
                  sx={{
                    color: 'text.secondary',
                    wordBreak: 'break-word',
                  }}
                >
                  {truncateString(description, 220)}
                </Typography>
              )}
            </Box>
          </Box>
        </Link>
      </CloseButtonWrapper>
    </Box>
  )
}

export default PostPreviewMeta
