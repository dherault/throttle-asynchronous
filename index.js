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

    const execute = () => Promise.resolve(fn(...args))
      .then(value => {
        decumulate()
        resolve({ hasResolved: true, value })
      })


    timeoutId = setTimeout(execute, delay)
  })
}

module.exports = throttle
