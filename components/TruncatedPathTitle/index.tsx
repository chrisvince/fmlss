import { Box } from '@mui/system'
import { ReactNode, useMemo } from 'react'

interface TruncatedPathTitleProps {
  pathTitleSegments: string[]
}

const TruncatedPathTitle = ({ pathTitleSegments }: TruncatedPathTitleProps) => {
  const elements: ReactNode[] = useMemo(() => {
    if (pathTitleSegments.length > 2) {
      return [pathTitleSegments[0], '...', pathTitleSegments.at(-1)]
    }

    return pathTitleSegments
  }, [pathTitleSegments])

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 0.25,
      }}
    >
      {elements.map((element, index) => (
        <>
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
        </>
      ))}
    </Box>
  )
}

export default TruncatedPathTitle
