import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import Avatar from 'cozy-ui/react/Avatar'
import { Button, ButtonLink } from 'cozy-ui/react/Button'
import Chip from 'cozy-ui/react/Chip'
import { FigureBlock } from 'cozy-ui/react/Figure'
import Icon from 'cozy-ui/react/Icon'
import Card from 'cozy-ui/react/Card'
import { Modal, ModalContent } from 'cozy-ui/react'
import { StepDurations, TimeDistribution } from './Graphs'

const {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} = require('cozy-ui/react/Tabs')

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

function displayFuncs(training, indexLayer) {
  try {
    var i = 0
    var out = []
    while (i < training.layers_da[indexLayer].layer_job.length) {
      if (
        training.layers_da[indexLayer].layer_job[i].args.weight != null &&
        training.layers_da[indexLayer].layer_job[i].args.weight != '' &&
        training.layers_da[indexLayer].layer_job[i].args.weight != ' '
      ) {
        out.push(
          <p>
            {training.layers_da[indexLayer].layer_job[i].func.label} of{' '}
            {JSON.stringify(
              training.layers_da[indexLayer].layer_job[i].args.keys
            )}{' '}
            with {training.layers_da[indexLayer].layer_job[i].args.weight} as
            weight
          </p>
        )
      } else {
        out.push(
          <p>
            {training.layers_da[indexLayer].layer_job[i].func.label} of{' '}
            {JSON.stringify(
              training.layers_da[indexLayer].layer_job[i].args.keys
            )}
          </p>
        )
      }

      i++
    }
    return out
  } catch (e) {
    alert(e)
  }
}

export class ViewModal extends Component {
  constructor(props, context) {
    super(props, context)
    // initial component state
    this.state = {
      boolModal: false,
      training: this.props.training
    }
  }

  render() {
    const { boolModal, training } = this.state

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
                <div>
                  <table className="tg">
                    <tr>
                      <th>
                        <b>Name :</b>
                      </th>
                      <th>{training.name}</th>
                    </tr>
                    <tr>
                      <th>
                        <b>State :</b>
                      </th>
                      <th>
                        <Icon
                          icon={
                            (training.state.Checkpoints['ci'] &&
                              'check-circle') ||
                            (!training.state.Checkpoints['ci'] && 'cross-small')
                          }
                          color={
                            (training.state.Checkpoints['ci'] && '#08b442') ||
                            (!training.state.Checkpoints['ci'] && '#F52D2D')
                          }
                        />
                        <Icon
                          icon={
                            (training.state.Checkpoints['fetch'] &&
                              'check-circle') ||
                            (!training.state.Checkpoints['fetch'] &&
                              'cross-small')
                          }
                          color={
                            (training.state.Checkpoints['fetch'] &&
                              '#08b442') ||
                            (!training.state.Checkpoints['fetch'] && '#F52D2D')
                          }
                        />
                        <Icon
                          icon={
                            (training.state.Checkpoints['tf'] &&
                              'check-circle') ||
                            (!training.state.Checkpoints['tf'] && 'cross-small')
                          }
                          color={
                            (training.state.Checkpoints['tf'] && '#08b442') ||
                            (!training.state.Checkpoints['tf'] && '#F52D2D')
                          }
                        />
                        <Icon
                          icon={
                            (training.state.Checkpoints['t'] &&
                              'check-circle') ||
                            (!training.state.Checkpoints['t'] && 'cross-small')
                          }
                          color={
                            (training.state.Checkpoints['t'] && '#08b442') ||
                            (!training.state.Checkpoints['t'] && '#F52D2D')
                          }
                        />
                        <Icon
                          icon={
                            (training.state.Checkpoints['da'] &&
                              'check-circle') ||
                            (!training.state.Checkpoints['da'] && 'cross-small')
                          }
                          color={
                            (training.state.Checkpoints['da'] && '#08b442') ||
                            (!training.state.Checkpoints['da'] && '#F52D2D')
                          }
                        />
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <b>Doctype :</b>
                      </th>
                      <th>{training.localquery.value}</th>
                    </tr>
                    <tr>
                      <th>
                        <b>Duration :</b>{' '}
                      </th>
                      <th>
                        {(new Date(
                          training.state.ExecutionMetadata.end
                        ).getTime() -
                          new Date(
                            training.state.ExecutionMetadata.start
                          ).getTime()) /
                          1000}
                        s
                      </th>
                    </tr>
                  </table>
                  <br />
                </div>

                <Tabs initialActiveTab="res">
                  <TabList>
                    <Tab name="targets">Target Profile</Tab>
                    <Tab name="aggr">Aggregation</Tab>
                    <Tab name="exe">Execution</Tab>
                    <Tab name="res">Results</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel name="targets">
                      <small>{training.targetProfile}</small>
                    </TabPanel>
                    <TabPanel name="aggr">
                      {(training => {
                        var out = []
                        const br = <br />
                        training.layers_da.forEach(function(item, index) {
                          out.push(
                            <Card>
                              <ContactChip
                                contact={{
                                  initials: index.toString(),
                                  name: 'Layer ' + index.toString()
                                }}
                              />
                              {displayFuncs(training, index)}
                            </Card>
                          )
                          out.push(br)
                        })
                        return out
                      })(training)}
                    </TabPanel>
                    <TabPanel name="exe">
                      <StepDurations training={training}></StepDurations>
                      <br />
                      <TimeDistribution training={training}></TimeDistribution>
                    </TabPanel>
                    <TabPanel name="res">
                      <form>
                        <div>
                          {(training => {
                            try {
                              var out = []
                              const br = <br />
                              for (var res in training.state.Results) {
                                out.push(
                                  <FigureBlock
                                    label={res}
                                    total={training.state.Results[res]}
                                    symbol=""
                                    coloredPositive
                                    coloredNegative
                                    signed
                                  />
                                )
                                out.push(br)
                              }
                              return out
                            } catch (e) {
                              alert(e)
                            }
                          })(training)}

                          <ButtonLink
                            label="Download Query as JSON"
                            target="_blank"
                            icon="download"
                            href={
                              'data:application/json;charset=utf-8,' +
                              encodeURIComponent(JSON.stringify(training))
                            }
                          />
                        </div>
                      </form>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </ModalContent>
            </Modal>
          </div>
        ) : (
          <Button
            onClick={() => this.setState({ boolModal: true })}
            label="More details"
            size="large"
            extension="narrow"
          />
        )}
      </div>
    )
  }

  componentDidMount() {
    const { training } = this.state
    const { client } = this.props

    client.stackClient
      .fetchJSON(
        'GET',
        '/remote/cc.cozycloud.dispers.state?idquery=' + training.queryid
      )
      .then(async response => {
        try {
          training.state = response
          await client.save(training)
          this.setState(() => ({
            training: training
          }))
        } catch (err) {
          alert(err)
          // TODO: Stop the spinner
          // TODO: Display error message in results
          /*
        this.setState(() => ({
          isWorking: false,
          isFinished: true,
        }))
        */
        }
      })
      .catch(error => {
        alert(error)
        // TODO: Stop the spinner
        // TODO: Display error message in results
        /*
      this.setState(() => ({
        isWorking: false,
        isFinished: true,
      }))
      */
      })
  }
}
// get mutations from the client to use createDocument
export default withClient(ViewModal)
