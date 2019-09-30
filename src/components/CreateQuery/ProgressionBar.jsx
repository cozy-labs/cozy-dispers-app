import React, { Component } from 'react'

import Chip from 'cozy-ui/react/Chip'
import Icon from 'cozy-ui/react/Icon'

const styles = {
  previousButton: { marginLeft: '20px' }
}

export class ProgressionBar extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { step } = this.props

    if (step != 0 && step != 5) {
      return (
        <span>
          <Chip theme={step == 0 ? 'primary' : 'normal'}>New</Chip>
          <Icon icon="right" color="#297ef2" style={styles.icon} />
          <Chip theme={step == 1 ? 'primary' : 'normal'}>Data-Owners</Chip>
          <Icon icon="right" color="#297ef2" style={styles.icon} />
          <Chip theme={step == 2 ? 'primary' : 'normal'}>Data</Chip>
          <Icon icon="right" color="#297ef2" style={styles.icon} />
          <Chip theme={step == 3 ? 'primary' : 'normal'}>Functions</Chip>
          <Icon icon="right" color="#297ef2" style={styles.icon} />
          <Chip theme={step == 4 ? 'primary' : 'normal'}>Save As</Chip>
        </span>
      )
    } else {
      return null
    }
  }
}

export default ProgressionBar
