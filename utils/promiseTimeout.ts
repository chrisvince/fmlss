const DELAY_DEFAULT = 1_000

const awaitTimeout = (delay = DELAY_DEFAULT) =>
  new Promise((_, reject) =>
    setTimeout(() => reject('The promise timed out'), delay)
  )

const promiseTimeout = <T>(promise: T, delay = DELAY_DEFAULT): T =>
  Promise.race([promise, awaitTimeout(delay)]) as T

export default promiseTimeout
