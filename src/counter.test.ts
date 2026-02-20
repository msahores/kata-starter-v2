import { expect, test } from 'vitest'
import { increment } from './counter'

test('increment function increases value by 1', () => {
  expect(increment(0)).toBe(1)
  expect(increment(10)).toBe(11)
})
