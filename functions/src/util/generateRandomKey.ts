import { randomBytes } from 'crypto'

const generateRandomKey = () => randomBytes(64).toString('hex')

export default generateRandomKey
