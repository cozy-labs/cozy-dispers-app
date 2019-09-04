import React from 'react'

import Spinner from 'cozy-ui/react/Spinner'
import Empty from 'cozy-ui/react/Empty'
import { queryConnect } from 'cozy-client'
import { dispersQueriesQuery } from 'doctypes'

import MLList from './MLList'

export const Results = props => {
  const { data, fetchStatus } = props.queries

  const isThereData = data.length != 0

  // cozy-client statuses
  const isLoading = fetchStatus === 'loading' || fetchStatus === 'pending'

  const styles = {
    empty: {
      position: 'relative',
      transform: 'translateZ(0)',
      height: '500px',
      display: 'flex'
    }
  }

  return (
    <div>
      <div>
        {isLoading ? (
          <Spinner size="xxlarge" middle />
        ) : (
          <div>
            {isThereData ? (
              <div>
                <MLList queries={data} />
              </div>
            ) : (
              <div>
                <div style={styles.empty}>
                  <Empty
                    icon="cozy"
                    title="You don't seem to have launched any query."
                    text="Try running some queries"
                  />
                </div>
              </div>
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
