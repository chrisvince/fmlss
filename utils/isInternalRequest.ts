import { NextApiRequest } from 'next'

const isInternalRequest = (req: NextApiRequest): boolean => {
  const { referer, host } = req.headers
  return !!host && !!referer?.includes(host)
}

export default isInternalRequest
