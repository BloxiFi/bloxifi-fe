import { gql } from '@apollo/client'

export interface DepositGraphVariables {
  orderBy: number
  orderDirection: 'desc' | 'asc'
}

interface User {
  id: string
}

interface Pool {
  lendingPool: string
}

interface DepositData {
  amount: string
  timestamp: number
  user: User
  pool: Pool
}

export interface DepositGraph {
  //TODO@any add all comments for every type in this file.
  deposits: DepositData[]
}

export const GRAPHQLEXAMPLEQUERY = gql`
  query MyQuery {
    deposits(orderBy: timestamp, orderDirection: desc) {
      amount
      timestamp
      user {
        id
      }
      pool {
        lendingPool
      }
    }
  }
`
