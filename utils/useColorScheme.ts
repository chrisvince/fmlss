import { useMediaQuery } from '@mui/material'
import useCookie from './useCookie'
import useUserData from './data/user/useUserData'
import { ColorScheme } from '../styles/theme'
import { ColorSchemeSetting } from '../types'

const useColorScheme = ({
  ssrValue,
}: { ssrValue?: ColorSchemeSetting } = {}) => {
  const { user, update: updateUser } = useUserData()
  const userSetting = user?.data?.settings.colorScheme
  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)')
  const systemColorScheme = systemIsDark ? ColorScheme.Dark : ColorScheme.Light

  const { value: cookieValue, update: updateCookie } = useCookie(
    'colorScheme',
    ssrValue ?? ColorSchemeSetting.System
  )

  const update = (newValue: ColorSchemeSetting) => {
    updateCookie(newValue, { expires: 365 })
    updateUser({
      ['settings.colorScheme']: newValue,
    })
  }

  const setting =
    userSetting ??
    (cookieValue as ColorSchemeSetting | undefined) ??
    ColorSchemeSetting.System

  const value = {
    [ColorSchemeSetting.System]: systemColorScheme,
    [ColorSchemeSetting.Light]: ColorScheme.Light,
    [ColorSchemeSetting.Dark]: ColorScheme.Dark,
  }[setting]

  return {
    value,
    update,
    setting,
  }
}

export default useColorScheme
