import { Link, Typography } from '@mui/material'
import { PostAttachmentUrl } from '../../types'

import truncateString from '../../utils/truncateString'
import PostAttachmentLayout, {
  PostAttachmentLayoutLayout,
} from '../PostAttachmentLayout'
import PostAttachmentBorder from '../PostAttachmentBorder'

const getIsLandscape = (width: number, height: number) =>
  width > 599 && height <= (width / 3) * 2

const getLayoutFromImageDimensions = (
  width: number | undefined,
  height: number | undefined
) => {
  if (!height || !width) {
    return PostAttachmentLayoutLayout.Text
  }

  if (getIsLandscape(width, height)) {
    return PostAttachmentLayoutLayout.MediaLarge
  }

  return PostAttachmentLayoutLayout.MediaSmall
}

interface Props {
  isAboveFold?: boolean
  attachment: PostAttachmentUrl
}

const PostAttachmentUrl = ({ isAboveFold, attachment }: Props) => {
  const { description, href, image, subtitle, title } = attachment
  const layout = getLayoutFromImageDimensions(image?.width, image?.height)

  return (
    <PostAttachmentBorder>
      <Link
        href={href}
        target="_blank"
        rel="noopener"
        underline="none"
        sx={{
          position: 'relative',
          display: 'block',
          px: 1.5,
          py: 1.5,
          transition: 'ease-in-out 200ms',
          transitionProperty: 'background-color',
        }}
      >
        <PostAttachmentLayout
          layout={layout}
          media={
            image ? (
              <picture>
                <img
                  alt={image.alt}
                  // @ts-expect-error: `fetchpriority` is not in types
                  fetchpriority={isAboveFold ? 'high' : undefined}
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  style={{
                    display: 'block',
                    height: '100%',
                    objectFit: 'contain',
                    width: '100%',
                  }}
                />
              </picture>
            ) : undefined
          }
          text={
            <>
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
            </>
          }
        />
      </Link>
    </PostAttachmentBorder>
  )
}

export default PostAttachmentUrl
