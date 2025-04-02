export function once<Fn extends (...args: any) => Promise<any>>(fn: Fn): Fn {
  let latestPromise: Promise<any> | null = null

  return ((...args) => {
    if (latestPromise)
      return latestPromise

    const promise = fn(...args)
    promise.catch((err) => {
      if (promise === latestPromise) {
        latestPromise = null
      }

      return Promise.reject(err)
    })

    latestPromise = promise
    return promise
  }) as Fn
}
