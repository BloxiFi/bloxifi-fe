// setup file
import '@testing-library/jest-dom'
import 'jest-styled-components'

require('jest-fetch-mock').enableMocks()

//needed because of recharts (ProgressBar) ResponsiveContainer (resize-observer)
const { ResizeObserver } = window

beforeEach(() => {
  delete window.ResizeObserver
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
})

afterEach(() => {
  window.ResizeObserver = ResizeObserver
  jest.restoreAllMocks()
})
