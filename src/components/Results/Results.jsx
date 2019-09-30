import React, { Component } from 'react'

import { FigureBlock } from 'cozy-ui/react/Figure'

export class Results extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { query } = this.props
    var out = []
    const br = <br />

    try {
      for (var res in query.state.Results) {
        if (res != 'length') {
          out.push(
            <FigureBlock
              label={res}
              total={query.state.Results[res]}
              symbol=""
              coloredPositive
              coloredNegative
              signed
            />
          )
          out.push(br)
        }
      }
      return out
    } catch (e) {
      alert(e)
    }
    return out
  }
}

export default Results
