function throttle(fn, delay) {
  let timeoutId
  const accumulator = []

  const decumulate = () => {
    accumulator.pop()
    accumulator.forEach(fn => fn())
    accumulator.length = 0
  }

  return (...args) => new Promise(resolve => {
    clearTimeout(timeoutId)

    accumulator.push(() => resolve({ hasResolved: false }))

    const execute = () => {
      const promiseOrValue = fn(...args)

      if (typeof promiseOrValue.then === 'function') {
        return promiseOrValue.then(value => {
          decumulate()
          resolve({
            hasResolved: true,
            value,
          })
        })
      }

      decumulate()

      resolve({
        hasResolved: true,
        value: promiseOrValue,
      })
    }

    timeoutId = setTimeout(execute, delay)
  })
}

module.exports = throttle
