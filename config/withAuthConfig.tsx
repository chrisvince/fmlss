import { AuthAction } from 'next-firebase-auth'

type Modes = 'public' | 'private'

const LoaderComponent = () => <p>Loading...</p>

type ConfigType = (mode: Modes) => any

export const withAuthUserTokenSSRConfig: ConfigType = (mode = 'public') => {
  switch (mode) {
    case 'public':
      return {
        whenAuthed: AuthAction.REDIRECT_TO_APP,
      }

    case 'private':
      return {
        whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
      }
  }
}

export const withAuthUserConfig: ConfigType = (mode = 'public') => {
  switch (mode) {
    case 'public':
      return {
        whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER,
        whenAuthed: AuthAction.REDIRECT_TO_APP,
        LoaderComponent,
      }

    case 'private':
      return {
        whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
        whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
        LoaderComponent,
      }
  }
}
