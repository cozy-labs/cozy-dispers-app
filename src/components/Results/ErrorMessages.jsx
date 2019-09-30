import React, { Component } from 'react'

import Chip from 'cozy-ui/react/Chip'

export class ErrorMessages extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { query } = this.props

    var out = []
    const br = <br />
    for (var task in query.state.ExecutionMetadata.tasks) {
      if (
        query.state.ExecutionMetadata.tasks[task].error != null &&
        query.state.ExecutionMetadata.tasks[task].error != ''
      ) {
        out.push(
          <Chip theme="error" variant="outlined">
            {query.state.ExecutionMetadata.tasks[task].error}
          </Chip>
        )
      }
    }

    return out
  }
}

export default ErrorMessages
