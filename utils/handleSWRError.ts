import { captureException } from '@sentry/nextjs'

const handleSWRError = (error: any) => {
  if (error.status === 403 || error.status === 404) {
    return
  }

  captureException(error, {
    tags: {
      source: 'useSWR',
    },
  })
}

export default handleSWRError
