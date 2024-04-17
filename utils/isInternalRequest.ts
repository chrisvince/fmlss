import { GetServerSidePropsContext } from 'next'

const isInternalRequest = (req: GetServerSidePropsContext['req']): boolean => {
  const { referer, host } = req.headers
  return !!host && !!referer?.includes(host)
}

export default isInternalRequest
