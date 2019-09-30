import React, { Component } from 'react'

import Avatar from 'cozy-ui/react/Avatar'
import Card from 'cozy-ui/react/Card'
import Chip from 'cozy-ui/react/Chip'

function displayFuncs(query, indexLayer) {
  try {
    var i = 0
    var out = []
    while (i < query.layers_da[indexLayer].layer_job.length) {
      out.push(<p>{query.layers_da[indexLayer].layer_job[i].title}</p>)
      i++
    }
    return out
  } catch (e) {
    alert(e)
  }
}

const ContactChip = ({ contact }) => (
  <Chip style={{ paddingLeft: '0.25rem' }}>
    <Avatar
      textId={contact.name}
      text={contact.initials}
      size="small"
      style={{ marginRight: '0.5rem' }}
    />{' '}
    {contact.name}
  </Chip>
)

export class AggregationLayers extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { query } = this.props
    var out = []
    const br = <br />

    query.layers_da.forEach(function(item, index) {
      out.push(
        <Card>
          <ContactChip
            contact={{
              initials: index.toString(),
              name: 'Layer ' + index.toString()
            }}
          />
          {displayFuncs(query, index)}
        </Card>
      )
      out.push(br)
    })
    return out
  }
}

export default AggregationLayers
