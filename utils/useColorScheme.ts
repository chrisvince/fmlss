import { useMediaQuery } from '@mui/material'
import useCookie from './useCookie'
import useUser from './data/user/useUser'
import { useMemo } from 'react'
import { ColorScheme } from '../styles/theme'
import { ColorSchemeSetting } from '../types'

const useColorScheme = ({ ssrValue }: { ssrValue?: string } = {}) => {
  const { user, update: updateUser } = useUser()
  const userSetting = user?.data?.settings.colorScheme
  const systemIsDark = useMediaQuery('(prefers-color-scheme: dark)')

  const { value: cookieValue, update: updateCookie } = useCookie(
    'colorScheme',
    ssrValue ?? ColorScheme.Light
  )

  const update = (newValue: ColorSchemeSetting) => {
    updateCookie(newValue, { expires: 365 })
    updateUser({
      ['settings.colorScheme']: newValue,
    })
  }

  const setting = userSetting ?? cookieValue ?? ColorSchemeSetting.Light

  const value = useMemo(() => {
    if (setting) {
      if (setting === ColorSchemeSetting.System) {
        return systemIsDark ? ColorScheme.Dark : ColorScheme.Light
      }

      return setting === ColorSchemeSetting.Dark
        ? ColorScheme.Dark
        : ColorScheme.Light
    }

    return ColorScheme.Light
  }, [setting, systemIsDark])

  return {
    value,
    update,
    setting: userSetting ?? cookieValue ?? ColorSchemeSetting.Light,
  }
}

export default useColorScheme
