import { createHash } from 'crypto'

export default (str: string) => createHash('md5').update(str).digest('hex')
