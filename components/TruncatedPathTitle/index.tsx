import { Box } from '@mui/system'
import { Fragment, ReactNode, useMemo } from 'react'
import { SubtopicSegment } from '../../types'

interface TruncatedPathTitleProps {
  subtopicSegments: SubtopicSegment[]
}

const TruncatedPathTitle = ({ subtopicSegments }: TruncatedPathTitleProps) => {
  const elements: ReactNode[] = useMemo(() => {
    if (subtopicSegments.length > 2) {
      return [
        subtopicSegments[0].pathTitle,
        '...',
        subtopicSegments.at(-1)?.pathTitle,
      ]
    }

    return subtopicSegments.map(({ pathTitle }) => pathTitle)
  }, [subtopicSegments])

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 0.25,
      }}
    >
      {elements.map((element, index) => (
        <Fragment key={`${element}-${index}`}>
          <Box
            key={`${element}-${index}`}
            sx={{
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              ...(elements.length > 1 && index === 0
                ? {
                    display: 'grid',
                    gridTemplateColumns: '0 auto',
                    color: 'transparent',
                    '&::after': {
                      content: "'...'",
                      color: 'text.secondary',
                    },
                    '@container postItem (min-width: 421px)': {
                      display: 'unset',
                      gridTemplateColumns: 'unset',
                      color: 'unset',
                      '&::after': {
                        content: 'unset',
                      },
                    },
                  }
                : {}),
            }}
          >
            {element}
          </Box>
          {index !== elements.length - 1 && '/'}
        </Fragment>
      ))}
    </Box>
  )
}

export default TruncatedPathTitle
