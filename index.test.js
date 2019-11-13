const throttle = require('./index');

const syncFn = (...args) => args
const asyncFn = (...args) => Promise.resolve(args)
const rejectedAsyncFn = (...args) => Promise.reject(new Error('oh oh'))

test('Resolves hasResolved and value', () => {
  const t = throttle(syncFn, 1000)

  expect(t(1, 2)).resolves.toEqual({ hasResolved: true, value: [1, 2] })

  const asyncT = throttle(asyncFn, 1000)

  expect(asyncT(1, 2)).resolves.toEqual({ hasResolved: true, value: [1, 2] })
});

test('Throttles like a turtle', () => {
  const t = throttle(syncFn, 1000)

  const p0 = t(0)
  const p1 = t(1, 2)
  const p2 = t(3, 4)

  expect(p0).resolves.toEqual({ hasResolved: false })
  expect(p1).resolves.toEqual({ hasResolved: false })
  expect(p2).resolves.toEqual({ hasResolved: true, value: [3, 4] })

  const asyncT = throttle(asyncFn, 1000)

  const p3 = asyncT(1, 2)
  const p4 = asyncT(3, 4)

  expect(p3).resolves.toEqual({ hasResolved: false })
  expect(p4).resolves.toEqual({ hasResolved: true, value: [3, 4] })
});

test('Throttles the right amount of times', async () => {
  let i = 0

  const asyncFn = () => new Promise(resolve => {
    i++
    setTimeout(() => resolve(true), 1000)
  })

  const t = throttle(asyncFn, 500)

  const p0 = t()
  const p1 = t()
  const p2 = t()

  expect(p0).resolves.toEqual({ hasResolved: false })
  expect(p1).resolves.toEqual({ hasResolved: false })
  expect(p2).resolves.toEqual({ hasResolved: true, value: true })

  await Promise.all([p0, p1, p2])

  expect(i).toEqual(1)
})


test('Rejects like a gentleman', () => {
  const t = throttle(rejectedAsyncFn, 1000)

  const p0 = t(0)
  const p1 = t(1, 2)
  const p2 = t(3, 4)

  expect(p0).rejects.toThrow('oh oh')
  expect(p1).rejects.toThrow('oh oh')
  expect(p2).rejects.toThrow('oh oh')
})
