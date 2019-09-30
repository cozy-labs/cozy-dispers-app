import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import { Button, ButtonLink } from 'cozy-ui/react/Button'
import { Modal, ModalContent } from 'cozy-ui/react'
import { StepDurations, TimeDistribution } from './Graphs'
import HeaderQuery from './HeaderQuery'
import AggregationLayers from './AggregationLayers'
import ErrorMessages from './ErrorMessages'
import Results from './Results'

const {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} = require('cozy-ui/react/Tabs')

export class ViewModal extends Component {
  constructor(props, context) {
    super(props, context)
    // initial component state
    this.state = {
      boolModal: false,
      query: this.props.query
    }
  }

  render() {
    const { boolModal, query } = this.state

    return (
      <div>
        {boolModal ? (
          <div>
            <Button
              onClick={() => this.setState({ boolModal: true })}
              label="more details"
              size="large"
              extension="narrow"
            />
            <Modal
              title="Details about your query"
              secondaryAction={() => {
                this.setState({ boolModal: false })
              }}
            >
              <ModalContent>
                <HeaderQuery query={this.props.query} />

                <Tabs initialActiveTab="res">
                  <TabList>
                    <Tab name="targets">Target Profile</Tab>
                    <Tab name="aggr">Aggregation</Tab>
                    <Tab name="exe">Execution</Tab>
                    <Tab name="res">Results</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel name="targets">
                      <font size="5">{query.targetProfile}</font>
                    </TabPanel>
                    <TabPanel name="aggr">
                      <AggregationLayers query={query} />
                    </TabPanel>
                    <TabPanel name="exe">
                      <ErrorMessages query={query} />
                      {new Date(query.state.ExecutionMetadata.end).getTime() !=
                        -62135596800000 && (
                        <div>
                          <StepDurations query={query}></StepDurations>
                          <TimeDistribution query={query}></TimeDistribution>
                        </div>
                      )}
                      <br />
                    </TabPanel>
                    <TabPanel name="res">
                      <form>
                        <div>
                          <Results query={query} />
                          <ButtonLink
                            label="Download Query as JSON"
                            target="_blank"
                            icon="download"
                            href={
                              'data:application/json;charset=utf-8,' +
                              encodeURIComponent(JSON.stringify(query))
                            }
                          />
                          <br />
                          <br />
                          <br />
                        </div>
                      </form>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </ModalContent>
            </Modal>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => this.setState({ boolModal: true })}
              label="More details"
              size="large"
              extension="narrow"
            />
          </div>
        )}
      </div>
    )
  }

  componentDidMount() {
    const { query } = this.state
    const { client } = this.props

    client.stackClient
      .fetchJSON(
        'GET',
        '/remote/cc.cozycloud.dispers.state?idquery=' + query.queryid
      )
      .then(async response => {
        try {
          query.state = response
          await client.save(query)
          this.setState(() => ({
            query: query
          }))
        } catch (err) {
          alert(err)
          // TODO: Stop the spinner
          // TODO: Display error message in results
        }
      })
      .catch(error => {
        alert(error)
      })
  }
}
// get mutations from the client to use createDocument
export default withClient(ViewModal)
