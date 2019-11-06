# throttle-asynchronous

[![npm version](https://badge.fury.io/js/throttle-asynchronous.svg)](https://badge.fury.io/js/throttle-asynchronous)

Throttle many promises, resolve once.

## Installation

`npm install throttle-asynchronous --save`

or

`yard add throttle-asynchronous`

## Usage

```js
import throttle from 'throttle-asynchronous'

const throttledFn = throttle(asyncFn, duration)

const { hasResolved, value } = await throttledFn(argsForAsyncFn)
```

Then you can call your throttled function in a batch:

```js
throttledFn(args) // promise: { hasResolved: false } Did not resolve because a sibling was invoked in the interval duration
throttledFn(args) // promise: { hasResolved: false }
throttledFn(args) // promise: { hasResolved: true, value: ... } Resolved because last in the batch
```

Works with synchronous functions too.

## Example

```js
import throttle from 'throttle-asynchronous'

// This function will be throttled to update only once per 1 second batch
function updateStory(text) {
  return database.stories.update('storyId', { text })
}

// If launched at an interval below 1000ms, only the last throttledUpdateStory will execute
const throttledUpdateStory = throttle(updateStory, 1000)

// Each keystroke will trigger input.onChange, hence the throttle
input.onChange = async text => {
  setState({ updated: false })

  const { hasResolved, value } = await throttledUpdateStory(text)

  if (hasResolved) {
    setState({ updated: true })

    console.log('response from database:', value)
  }
}
```
