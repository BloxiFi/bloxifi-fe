import { renderHook } from '@testing-library/react-hooks'
import { expect } from '@jest/globals'

import { useWalletBalance } from '../useWalletBalance'

test('should show empty array', () => {
  const { result } = renderHook(() =>
    useWalletBalance({ currentAccount: 'xSomeAccount', currentChainId: 1287 }),
  )

  expect(result.current.balances).toEqual([])
})
