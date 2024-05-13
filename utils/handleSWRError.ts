import { captureException, withScope } from '@sentry/nextjs'
import { BareFetcher, PublicConfiguration } from 'swr/dist/_internal'

const handleSWRError = (
  error: any,
  key: string,
  config: Readonly<PublicConfiguration<any, any, BareFetcher<any>>>
) => {
  if (error.status === 403 || error.status === 404) {
    return
  }

  withScope(scope => {
    scope.setTag('key', key)
    scope.setTag('source', 'useSWR')
    scope.setContext('SWR Config', config)
    captureException(error)
  })
}

export default handleSWRError
