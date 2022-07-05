import { gql } from '@apollo/client'

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
