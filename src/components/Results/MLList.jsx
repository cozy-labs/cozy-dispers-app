import React from 'react'

import TrainingsRemoveButton from './TrainingsRemoveButton'
import ViewModal from './ViewModal'
import Card from 'cozy-ui/react/Card'
import Chip from 'cozy-ui/react/Chip'
import Icon from 'cozy-ui/react/Icon'

export const MLList = props => {
  const { queries } = props

  let stylesRow = {
    padding: '3%'
  }

  let stylesBox = {
    backgroundColor: 'rgb(245,246,247)',
    padding: '3%',
    borderRadius: '20px'
  }

  if (!queries || !queries.length) return null

  return (
    <div>
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
                      )
                    </h3>
                  </p>
                  <em>{mTrain.status}</em>
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
  )
}

export default MLList
