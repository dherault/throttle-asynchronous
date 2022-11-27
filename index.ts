function throttle(fn: (...args: any[]) => any, delay: number) {
  let timeoutId: NodeJS.Timeout
  const accumulator: (() => void)[] = []

  return (...args: any[]) => new Promise(resolve => {
    clearTimeout(timeoutId)

    accumulator.push(() => resolve({ hasResolved: false }))

    const execute = () => Promise.resolve(fn(...args))
      .then(value => {
        accumulator.pop()
        accumulator.forEach(fn => fn())
        accumulator.length = 0
        resolve({ hasResolved: true, value })
      })

    timeoutId = setTimeout(execute, delay)
  })
}

export default throttle
