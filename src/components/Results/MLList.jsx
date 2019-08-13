import React, { Component } from 'react'

import { withMutations } from 'cozy-client'
import TrainingsRemoveButton from './TrainingsRemoveButton'
import ViewModal from './ViewModal'
import Card from 'cozy-ui/react/Card'
import Chip from 'cozy-ui/react/Chip'
import Icon from 'cozy-ui/react/Icon'
import Button from 'cozy-ui/react/Button'

export class MLList extends Component {
  constructor(props) {
    super(props)
  }

  clearAll = async () => {
    const { queries, deleteDocument } = this.props

    queries.map(async query => {
      await deleteDocument(query)
    })
  }

  render() {
    const { queries } = this.props

    let stylesRow = {
      padding: '1%'
    }

    let stylesBox = {
      backgroundColor: 'rgb(245,246,247)',
      padding: '1%',
      borderRadius: '20px'
    }

    let styles = {
      marginLeft: '20%',
      marginRight: '20%'
    }

    if (!queries || !queries.length) return null

    return (
      <div>
        <Button
          key="clearall"
          theme="danger"
          label="Clear all"
          onClick={this.clearAll}
        />
        <div style={styles}>
          <div className="column">
            {queries.map(mTrain => (
              <div className="row" key={mTrain._id} style={stylesRow}>
                <div style={stylesBox}>
                  <Card>
                    {(mTrain => {
                      var out = []
                      mTrain.labels.forEach(function(item) {
                        out.push(
                          <Chip component="span" theme="primary">
                            {item}
                          </Chip>
                        )
                      })
                      return out
                    })(mTrain)}

                    <center>
                      <p>
                        <h3>
                          {mTrain.name} (
                          {
                            <Icon
                              icon={
                                (mTrain.isEncrypted && 'lock') ||
                                (!mTrain.isEncrypted && 'unlock')
                              }
                              color="#B449E7"
                            />
                          }
                          ) - <em>{mTrain.status}</em>
                        </h3>
                      </p>
                    </center>
                    <p>
                      <b>QueryID :</b>
                    </p>
                    <p>
                      <b>Created at :</b> {mTrain.cozyMetadata.createdAt}
                    </p>

                    <center>
                      <table>
                        <tr>
                          <th>
                            <ViewModal training={mTrain} />
                          </th>
                          <th />
                          <th>
                            <TrainingsRemoveButton training={mTrain} />
                          </th>
                        </tr>
                      </table>
                    </center>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

// get mutations from the client to use deleteDocument
export default withMutations()(MLList)
