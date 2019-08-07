import React from 'react'

import Spinner from 'cozy-ui/react/Spinner'
import { queryConnect } from 'cozy-client'
import { dispersQueriesQuery } from 'doctypes'

import MLList from './MLList'

export const Results = props => {
  const { data, fetchStatus } = props.queries
  let styles = {
    marginLeft: '25%',
    marginRight: '25%'
  }

  const isThereData = data.length != 0

  // cozy-client statuses
  const isLoading = fetchStatus === 'loading' || fetchStatus === 'pending'

  return (
    <div>
      <h1>Your queries</h1>
      <br />
      <br />
      <div style={styles}>
        {isLoading ? (
          <Spinner size="xxlarge" middle />
        ) : (
          <div>
            {isThereData ? (
              <MLList queries={data} />
            ) : (
              <h2>You don&apos;t seem to have launched any query yet.</h2>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// get data from the client state: data, fetchStatus
export default queryConnect({
  queries: {
    query: dispersQueriesQuery,
    as: 'queries'
  }
})(Results)
