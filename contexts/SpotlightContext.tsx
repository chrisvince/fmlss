import { Backdrop, useTheme } from '@mui/material'
import { createContext, useState } from 'react'

export enum SpotlightElement {
  Feed = 'feed',
  PostPagePostItem = 'postPagePostItem',
}

export interface SpotlightContextProps {
  spotlightItem: SpotlightElement | null
  setSpotlightItem: (spotlightItem: SpotlightElement | null) => void
}

const spotlightContextDefaultValue: SpotlightContextProps = {
  spotlightItem: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSpotlightItem: () => {},
}

const SpotlightContext = createContext(spotlightContextDefaultValue)

const SpotlightContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [spotlightItem, setSpotlightItem] = useState(
    spotlightContextDefaultValue.spotlightItem
  )
  const theme = useTheme()

  return (
    <SpotlightContext.Provider
      value={{
        spotlightItem,
        setSpotlightItem,
      }}
    >
      <Backdrop
        open={!!spotlightItem}
        onClick={() => setSpotlightItem(null)}
        sx={{
          zIndex: theme.zIndex.modal + 1,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgb(255 255 255 / 25%)'
              : 'rgb(0 0 0 / 25%)',
        }}
      />
      {children}
    </SpotlightContext.Provider>
  )
}

export default SpotlightContext

export {
  SpotlightContext,
  spotlightContextDefaultValue,
  SpotlightContextProvider,
}
