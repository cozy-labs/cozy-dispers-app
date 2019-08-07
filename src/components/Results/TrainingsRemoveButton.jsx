import React, { Component } from 'react'

import Button from 'cozy-ui/react/Button'
import { withMutations } from 'cozy-client'

export class TrainingsRemoveButton extends Component {
  constructor(props) {
    super(props)
    // initial component state
    this.state = { isWorking: false }
  }

  // delete the related training
  removeTrainings = async () => {
    const { deleteDocument, training } = this.props
    // display a spinner during the process
    this.setState(() => ({ isWorking: true }))
    // delete the training in the Cozy : asynchronous
    await deleteDocument(training)
    // remove the spinner
    // this.setState(() => ({ isWorking: false }))
    // We can omit that since this component will be
    // unmount after the document is deleted by the client
  }

  render() {
    const { isWorking } = this.state
    return (
      <Button
        theme="danger"
        icon="trash"
        label="delete"
        iconOnly
        busy={isWorking}
        disabled={isWorking}
        onClick={this.removeTrainings}
      />
    )
  }
}

// get mutations from the client to use deleteDocument
export default withMutations()(TrainingsRemoveButton)
