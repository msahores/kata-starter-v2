import { describe, it, expect } from 'vitest'
import { kata } from './kata'

describe('kata', () => {
  it('should work', () => {
    expect(kata()).toBe(undefined)
  })
})
