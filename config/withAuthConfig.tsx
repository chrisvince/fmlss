import { AuthAction } from 'next-firebase-auth'

type Modes = 'SEND_AUTHED_TO_APP' | 'SEND_UNAUTHED_TO_LOGIN'

const LoaderComponent = () => <p>Loading...</p>

type ConfigType = (mode: Modes) => any

export const withAuthUserTokenSSRConfig: ConfigType = (
  mode = 'SEND_AUTHED_TO_APP'
) => {
  switch (mode) {
    case 'SEND_AUTHED_TO_APP':
      return {
        whenAuthed: AuthAction.REDIRECT_TO_APP,
      }

    case 'SEND_UNAUTHED_TO_LOGIN':
      return {
        whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
      }
  }
}

export const withAuthUserConfig: ConfigType = (mode = 'SEND_AUTHED_TO_APP') => {
  switch (mode) {
    case 'SEND_AUTHED_TO_APP':
      return {
        whenAuthedBeforeRedirect: AuthAction.SHOW_LOADER,
        whenAuthed: AuthAction.REDIRECT_TO_APP,
        LoaderComponent,
      }

    case 'SEND_UNAUTHED_TO_LOGIN':
      return {
        whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
        whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
        LoaderComponent,
      }
  }
}
