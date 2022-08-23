import { Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'

import truncateString from '../../utils/truncateString'

const IMAGE_SMALL_SIZE: number = 80

interface GetLayoutFromImageDimensions {
  height?: number
  width?: number
}

const getLayoutFromImageDimensions = ({
  height,
  width,
}: GetLayoutFromImageDimensions = {}) => {
  if (!height || !width) {
    return 'text'
  }
  if (width > 800 && height <= ((width / 3) * 2)) {
    return 'imageLarge'
  }
  return 'imageSmall'
}

interface ImageNaturalDimensions {
  width: number
  height: number
}

interface Props {
  href: string
  title?: string
  subtitle?: string
  description?: string
  image?: {
    src?: string
    alt?: string
  }
}

const PostCard = ({ href, image, description, title, subtitle }: Props) => {
  const [imageNaturalDimensions, setImageNaturalDimensions] = useState<ImageNaturalDimensions>()

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
    }
  }, [image])

  if (image?.src && !imageNaturalDimensions) {
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
      sx={{
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
          },
        },
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

export default PostCard
