const promiseOnlyFulfilled = <T>(promises: Promise<T>[]): Promise<T[]> =>
  Promise.allSettled(promises).then(results =>
    (
      results.filter(
        ({ status }) => status === 'fulfilled'
      ) as PromiseFulfilledResult<T>[]
    ).map(({ value }) => value)
  ) as Promise<T[]>

export default promiseOnlyFulfilled
