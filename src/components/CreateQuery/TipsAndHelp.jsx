import React, { Component } from 'react'

import Accordion, { AccordionItem } from 'cozy-ui/react/Accordion'
import Infos from 'cozy-ui/react/Infos'

export class TipsAndHelp extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { step } = this.props

    switch (step) {
      case 1:
        return (
          <Accordion>
            <AccordionItem label="Tips and help">
              <Infos
                title="How to build your target profile"
                icon="info"
                text="Target Profile is a logical operation made with OR, AND, and concepts that defines which Cozy is going to participate to your query. A concept is a caracteristic about one user. The separator between two concepts is ','."
              />
              <ul style={{ color: '#555555' }}>
                <li>{'"imc=surpoids"'}</li>
                <li>{'OR("maladie=cancer","imc=obesite-moderee")'}</li>
                <li>{'AND("maladie=cancer","imc=obesite-moderee")'}</li>
                <li>
                  {
                    'OR(AND("maladie=cancer","imc=obesite-moderee"),"maladie=diabete")'
                  }
                </li>
                <li>
                  {
                    'OR(AND("maladie=cancer","imc=obesite-moderee"),AND("imc=normal","maladie=alzheimer"))'
                  }
                </li>
                <li>
                  {
                    'OR(AND("maladie=cancer","imc=obesite-moderee")AND("imc=normal","maladie=alzheimer"))'
                  }
                </li>
              </ul>
            </AccordionItem>
          </Accordion>
        )
      case 2:
        return (
          <Accordion>
            <AccordionItem label="Tips and help">
              <Infos
                title="On which doctype do you want to compute the query ?"
                icon="info"
                text="In the next step, you will have to specify the operation that will be made and on which key from the doctype you are choosing right now"
              />

              <Infos
                title="The less data, the fastest"
                icon="multi-files"
                text="You can choose if you want to retrieve every data from one Cozy, or just a sample. Most of the time, a sample is enough. Keep the field empty if you want to compute over all the data."
              />
            </AccordionItem>
          </Accordion>
        )
      case 3:
        return (
          <Accordion>
            <AccordionItem label="Tips and help">
              <Infos
                title="What's the Main Data Aggregator ?"
                icon="people"
                text="Setting several DA's imply that results from each DA have to be merged."
              />
              <Infos
                title="Several Data Aggregators for a safer query"
                icon="team"
                text="By setting several DAs, you build a stronger query. The less Data a DA receives, the less possible a statistic attack will be. Furthermore, the query should be faster."
              />
              <Infos
                title="What's in Input ? What's in Output ?"
                icon="merge"
                text="The first layer of DA receives data from Targets, layer n+1 receives results from n. Data are merged after layer n, shuffled and distributed to layer n+1"
              />
              <Infos
                title="Every Data Aggregator is independant"
                icon="unlink"
                text="Every DA on one layer computes the same treatment but on a different datasets, and possibly in a different execution environnement"
              />
            </AccordionItem>
          </Accordion>
        )

      case 4:
        return (
          <Accordion>
            <AccordionItem label="Tips and help">
              <Infos
                title="Make your query easier to retrieve"
                icon="file-type-files"
                text="For now, this panel is only useful to easily retrieve queries afterwards."
              />
            </AccordionItem>
          </Accordion>
        )

      default:
        return null
    }
  }
}

export default TipsAndHelp
