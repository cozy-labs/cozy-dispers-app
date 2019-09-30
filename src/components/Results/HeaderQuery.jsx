import React, { Component } from 'react'

import Icon from 'cozy-ui/react/Icon'

export class HeaderQuery extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { query } = this.props

    return (
      <div>
        <center>
          <table className="tg">
            <tr>
              <th>
                <b>Name :</b>
              </th>
              <th>{query.name}</th>
            </tr>
            <tr>
              <th>
                <b>State :</b>
              </th>
              <th>
                <Icon
                  icon={
                    (query.state.Checkpoints['ci'] && 'check-circle') ||
                    (!query.state.Checkpoints['ci'] && 'cross-small')
                  }
                  color={
                    (query.state.Checkpoints['ci'] && '#08b442') ||
                    (!query.state.Checkpoints['ci'] && '#F52D2D')
                  }
                />
                <Icon
                  icon={
                    (query.state.Checkpoints['fetch'] && 'check-circle') ||
                    (!query.state.Checkpoints['fetch'] && 'cross-small')
                  }
                  color={
                    (query.state.Checkpoints['fetch'] && '#08b442') ||
                    (!query.state.Checkpoints['fetch'] && '#F52D2D')
                  }
                />
                <Icon
                  icon={
                    (query.state.Checkpoints['tf'] && 'check-circle') ||
                    (!query.state.Checkpoints['tf'] && 'cross-small')
                  }
                  color={
                    (query.state.Checkpoints['tf'] && '#08b442') ||
                    (!query.state.Checkpoints['tf'] && '#F52D2D')
                  }
                />
                <Icon
                  icon={
                    (query.state.Checkpoints['t'] && 'check-circle') ||
                    (!query.state.Checkpoints['t'] && 'cross-small')
                  }
                  color={
                    (query.state.Checkpoints['t'] && '#08b442') ||
                    (!query.state.Checkpoints['t'] && '#F52D2D')
                  }
                />
                <Icon
                  icon={
                    (query.state.Checkpoints['da'] && 'check-circle') ||
                    (!query.state.Checkpoints['da'] && 'cross-small')
                  }
                  color={
                    (query.state.Checkpoints['da'] && '#08b442') ||
                    (!query.state.Checkpoints['da'] && '#F52D2D')
                  }
                />
              </th>
            </tr>
            <tr>
              <th>
                <b>Doctype :</b>
              </th>
              <th>{query.localquery.value}</th>
            </tr>
            {new Date(query.state.ExecutionMetadata.end).getTime() !=
              -62135596800000 && (
              <tr>
                <th>
                  <b>Duration :</b>{' '}
                </th>
                <th>
                  {(new Date(query.state.ExecutionMetadata.end).getTime() -
                    new Date(query.state.ExecutionMetadata.start).getTime()) /
                    1000}
                  s
                </th>
              </tr>
            )}
          </table>
        </center>
        <br />
      </div>
    )
  }
}

export default HeaderQuery
