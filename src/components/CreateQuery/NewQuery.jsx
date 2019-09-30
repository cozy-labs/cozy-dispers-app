import React, { Component } from 'react'
import { withClient } from 'cozy-client'

// UI
import Accordion from 'cozy-ui/react/Accordion'
import Button from 'cozy-ui/react/Button'
import ButtonAction from 'cozy-ui/react/ButtonAction'
import Card from 'cozy-ui/react/Card'
import Checkbox from 'cozy-ui/react/Checkbox'
import Chip from 'cozy-ui/react/Chip'
import Empty from 'cozy-ui/react/Empty'
import Label from 'cozy-ui/react/Label'
import Icon from 'cozy-ui/react/Icon'
import Input from 'cozy-ui/react/Input'
import InputGroup from 'cozy-ui/react/InputGroup'
import { Modal, ModalContent } from 'cozy-ui/react'
import SelectBox from 'cozy-ui/react/SelectBox'
const CheckboxOption = require('cozy-ui/react/SelectBox').CheckboxOption

// Imports from Assets and others classes
import { optionsConcept } from 'assets/concepts.js'
import { optionsModels, blank, mean, min } from './Models.jsx'
import AggregationFunction from './AggregationFunction'
import ProgressionBar from './ProgressionBar'
import TipsAndHelp from './TipsAndHelp'
import { QUERIES_DOCTYPE } from 'doctypes'
import { buildInputQuery } from './analyzeForm'

const optionsDataset = [
  { label: 'io.cozy.bank.operations', value: 'io.cozy.bank.operations' }
]

const optionsLabels = [
  { label: 'Work', value: 'work' },
  { label: 'Health', value: 'health' },
  { label: 'Finance', value: 'finance' }
]

const styles = {
  card: {
    backgroundColor: '#E0E6F8',
    marginRight: '10%'
  },
  empty: {
    position: 'relative',
    transform: 'translateZ(0)',
    height: '500px',
    display: 'flex'
  },
  icon: { marginRight: '5px' }
}

export class NewQuery extends Component {
  constructor(props, context) {
    super(props, context)

    // initial component state
    this.state = {
      step: 0,
      modelSelector: { value: 'mean', label: 'Load Mean/Std' },
      boolModal: false,
      isWorking: false,
      titleMsg: 'The query is running',
      msg: 'Go to "Saved Queries" to follow it'
    }
  }

  // create the new query
  handleRun = async () => {
    const { client } = this.props
    const {
      localquery,
      isEncrypted,
      targetProfile,
      limitedObs,
      labels,
      limit,
      layers_da,
      name,
      step
    } = this.state

    // reset the input and display a spinner during the process
    this.setState(() => ({ isWorking: true }))
    var success = false

    // build the body of the http request
    try {
      var body = buildInputQuery(
        localquery,
        isEncrypted,
        targetProfile,
        layers_da,
        limitedObs,
        limit
      )
      success = true
    } catch (e) {
      this.setState(() => ({
        isWorking: false,
        step: step + 1,
        titleMsg: 'Error',
        msg: e.toString()
      }))
    }

    if (success) {
      try {
        client.stackClient
          .fetchJSON('POST', '/remote/cc.cozycloud.dispers.query', body)
          .then(async response => {
            try {
              await client.create(QUERIES_DOCTYPE, {
                localquery: localquery,
                isEncrypted: isEncrypted,
                targetProfile: targetProfile,
                labels: labelsToAdd,
                layers_da: layers_da,
                name: name,
                queryid: response['query_id']
              })
              this.setState(() => ({
                isWorking: false,
                step: step + 1,
                titleMsg: 'The query is running',
                msg: 'Go to "Saved Queries" to follow it'
              }))
            } catch (err) {
              this.setState(() => ({
                isWorking: false,
                step: step + 1,
                titleMsg: 'Error while saving query on your database',
                msg: err.toString()
              }))
            }
          })
          .catch(error => {
            this.setState(() => ({
              isWorking: false,
              step: step + 1,
              titleMsg: 'Cozy-DISPERS returned an error',
              msg: error.toString()
            }))
          })
      } catch (e) {
        this.setState(() => ({
          isWorking: false,
          step: step + 1,
          titleMsg: 'Could not pass the request',
          msg: e.toString()
        }))
      }

      var labelsToAdd = []
      labels.forEach(function(item) {
        labelsToAdd.push(item.label)
      })

      // remove the spinner
      this.setState(() => ({
        isWorking: false,
        step: step + 1,
        titleMsg: 'Requesting...',
        msg: ''
      }))
    }
  }

  reset = () => {
    this.setState(() => this.initialState)
  }

  displayArgs = () => {
    var out = []
    const br = <br />

    try {
      const { layers_da, selectedLayer } = this.state
      out.push(<Label htmlFor="func0">{'Aggregation function(s)'}</Label>)
      out.push(br)
      out.push(
        <ButtonAction
          label="Add function"
          rightIcon="plus"
          onClick={() => {
            var { layers_da, selectedLayer } = this.state
            layers_da[selectedLayer - 1].layer_job.push({
              title: '',
              func: { title: '', label: '', value: '' },
              args: []
            })
            this.setState({
              layers_da: layers_da
            })
          }}
        />
      )
      out.push(br)
      out.push(br)
      out.push(br)
      for (
        let idxJob = 0;
        idxJob < layers_da[selectedLayer - 1].layer_job.length;
        idxJob++
      ) {
        out.push(
          <AggregationFunction
            id={'func' + idxJob}
            json={layers_da[selectedLayer - 1].layer_job[idxJob]}
            onChange={(func, args, title) => {
              try {
                var { layers_da } = this.state
                layers_da[selectedLayer - 1].layer_job[idxJob].title = title
                layers_da[selectedLayer - 1].layer_job[idxJob].func = func
                layers_da[selectedLayer - 1].layer_job[idxJob].args = args
                this.setState({ layers_da: layers_da })
              } catch (e) {
                alert(e)
              }
            }}
            onDelete={() => {
              var { layers_da } = this.state
              layers_da[selectedLayer - 1].layer_job.splice(idxJob, 1)
              this.setState({ layers_da: layers_da })
            }}
          />
        )
      }
      return out
    } catch (e) {
      alert(e)
    }
  }

  render() {
    const {
      localquery,
      layers_da,
      modelSelector,
      selectedLayer,
      isEncrypted,
      targetProfile,
      limit,
      conceptSelector,
      labels,
      step,
      name,
      titleMsg,
      msg
    } = this.state

    try {
      // Render is shared in 6 screens
      // - Choose a Template or start from scratch
      // - Choose the Target Profile
      // - Select info about queried data
      // - Compose aggregation
      // - Add metadata about the query
      return (
        <div>
          <form onSubmit={this.handleRun}>
            <br />
            <div>
              <center>
                <ProgressionBar step={this.state.step} />
                {step != 0 && step != 5 && (
                  <Button
                    label="Previous"
                    theme="secondary"
                    type="button"
                    style={styles.previousButton}
                    onClick={() => {
                      var { step } = this.state
                      if (step != 0) {
                        step = step - 1
                      }
                      this.setState({ step: step })
                    }}
                  />
                )}
                {step != 0 && step != 4 && step != 5 && (
                  <Button
                    label="Next"
                    type="button"
                    theme="regular"
                    onClick={() => {
                      const { step } = this.state
                      if (step < 4) {
                        this.setState({ step: step + 1 })
                      }
                    }}
                  />
                )}
                {step != 0 && step != 5 && step == 4 && (
                  <Button label="Run" type="submit" theme="highlight" />
                )}
              </center>
              <br />
            </div>
            {(step == 0 && (
              <div>
                <h1>New query</h1>
                <br />
                <br />
                <Card style={styles.card}>
                  <h2>Start from scratch</h2>
                  <Button
                    label="Choose"
                    theme="primary"
                    type="button"
                    onClick={() => {
                      var { step } = this.state
                      this.setState(blank)
                      this.setState({
                        step: step + 1
                      })
                    }}
                  />
                </Card>
                <br />
                <br />
                <Card style={styles.card}>
                  <h2>Load a template</h2>
                  <InputGroup
                    prepend={
                      <Button
                        label="Choose"
                        theme="primary"
                        type="button"
                        onClick={() => {
                          var { step } = this.state
                          if (modelSelector.value == 'mean') {
                            this.setState(mean)
                          } else if (modelSelector.value == 'min') {
                            this.setState(min)
                          } else {
                            this.setState(blank)
                          }
                          this.setState({
                            step: step + 1
                          })
                        }}
                      />
                    }
                  >
                    <SelectBox
                      value={modelSelector}
                      onChange={event => {
                        this.setState({ modelSelector: event })
                      }}
                      options={optionsModels}
                      id="idConcepts"
                    />
                  </InputGroup>
                </Card>
              </div>
            )) ||
              (step == 1 && (
                <div>
                  <h1>Select the targeted Cozy... </h1>
                  <br />
                  <Card style={styles.card}>
                    <center>
                      <div>
                        <Button
                          label="And("
                          type="button"
                          theme="secondary"
                          onClick={() => {
                            var { tabTargetProfile } = this.state
                            tabTargetProfile.push('AND(')
                            this.setState({
                              tabTargetProfile: tabTargetProfile,
                              targetProfile: tabTargetProfile.join('')
                            })
                          }}
                        />
                        <Button
                          label="Or("
                          type="button"
                          theme="secondary"
                          onClick={() => {
                            var { tabTargetProfile } = this.state
                            tabTargetProfile.push('OR(')
                            this.setState({
                              tabTargetProfile: tabTargetProfile,
                              targetProfile: tabTargetProfile.join('')
                            })
                          }}
                        />
                        <Button
                          label=","
                          type="button"
                          theme="secondary"
                          onClick={() => {
                            var { tabTargetProfile } = this.state
                            tabTargetProfile.push(',')
                            this.setState({
                              tabTargetProfile: tabTargetProfile,
                              targetProfile: tabTargetProfile.join('')
                            })
                          }}
                        />
                        <Button
                          label=")"
                          type="button"
                          theme="secondary"
                          onClick={() => {
                            var { tabTargetProfile } = this.state
                            tabTargetProfile.push(')')
                            this.setState({
                              tabTargetProfile: tabTargetProfile,
                              targetProfile: tabTargetProfile.join('')
                            })
                          }}
                        />
                        <Button
                          label="DEL"
                          type="button"
                          icon="previous"
                          theme="danger-outline"
                          onClick={() => {
                            var { tabTargetProfile } = this.state
                            tabTargetProfile.splice(-1, 1)
                            this.setState({
                              tabTargetProfile: tabTargetProfile,
                              targetProfile: tabTargetProfile.join('')
                            })
                          }}
                        />
                      </div>
                      <br />
                      <div>
                        <InputGroup
                          append={
                            <Button
                              label="Add"
                              type="button"
                              onClick={() => {
                                const { conceptSelector } = this.state
                                var { tabTargetProfile } = this.state
                                tabTargetProfile.push(
                                  '"' + conceptSelector.value + '"'
                                )
                                this.setState({
                                  tabTargetProfile: tabTargetProfile,
                                  targetProfile: tabTargetProfile.join('')
                                })
                              }}
                            />
                          }
                        >
                          <SelectBox
                            value={conceptSelector}
                            onChange={event => {
                              this.setState({ conceptSelector: event })
                            }}
                            options={optionsConcept}
                            id="idConcepts"
                          />
                        </InputGroup>
                      </div>
                    </center>
                    <br />
                    <br />

                    <div style={{ backgroundColor: 'white' }}>
                      <Card>
                        <p>
                          {(() => {
                            const { tabTargetProfile } = this.state
                            var out = []
                            if (tabTargetProfile.length != 0) {
                              for (
                                let idx = 0;
                                idx < tabTargetProfile.length;
                                idx++
                              ) {
                                out.push(
                                  <a
                                    style={{
                                      backgroundColor: '#E0E6F8',
                                      margin: '3px',
                                      fontSize:
                                        10 +
                                        100 / (targetProfile.length + 1) +
                                        'pt',
                                      padding: '5px',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    {tabTargetProfile[idx]}
                                  </a>
                                )
                              }
                            } else {
                              out.push(
                                <a
                                  style={{
                                    fontSize: '20pt',
                                    color: '#AAAAAA'
                                  }}
                                >
                                  Create a target profile using the buttons...
                                </a>
                              )
                            }
                            return out
                          })()}
                        </p>
                      </Card>
                    </div>
                  </Card>

                  <br />
                  <br />
                  <br />
                  <TipsAndHelp step={this.state.step} />
                </div>
              )) ||
              (step == 2 && (
                <div>
                  <h1>What data do you want to use ? </h1>
                  <br />
                  <Label htmlFor="idDatasets">Choose a doctype</Label>
                  <SelectBox
                    id="idDatasets"
                    value={localquery}
                    onChange={event => {
                      this.setState({ localquery: event })
                    }}
                    options={optionsDataset}
                    placeholder="Select ..."
                  />
                  <br />
                  <div>
                    <Label htmlFor="limit">
                      Maximal size of data retrieved from each cozy (OPTIONAL)
                    </Label>
                    <Input
                      id="limit"
                      type="number"
                      onChange={event => {
                        var limitedObs = event.target.value > 0

                        this.setState({
                          limit: event.target.value,
                          limitedObs: limitedObs
                        })
                      }}
                      value={limit}
                      min="1"
                      step="1"
                    />
                  </div>

                  <br />
                  <br />
                  <br />
                  <TipsAndHelp step={this.state.step} />
                </div>
              )) ||
              (step == 3 && (
                <div>
                  <h1>What do we do with this data ? </h1>
                  <br />
                  <br />
                  <div>
                    {(() => {
                      try {
                        const { layers_da } = this.state
                        const br = <br />
                        var out = []
                        for (
                          let idxLayer = 0;
                          idxLayer < layers_da.length;
                          idxLayer++
                        ) {
                          out.push(
                            <Chip
                              name={idxLayer + 1}
                              style={
                                (idxLayer == layers_da.length - 1 && {
                                  marginRight: '2rem',
                                  color: '#297ef2'
                                }) || {
                                  marginRight: '1.2rem',
                                  color: '#297ef2'
                                }
                              }
                            >
                              <Icon
                                icon="stack"
                                style={{ marginRight: '1.2rem' }}
                              />
                              {(idxLayer == layers_da.length - 1 && 'MDA') ||
                                `Layer ${idxLayer + 1}`}
                            </Chip>
                          )
                          out.push(
                            <Chip.Button
                              theme="normal"
                              variant="outlined"
                              onClick={() => {
                                this.setState({
                                  selectedLayer: idxLayer + 1,
                                  boolModal: true
                                })
                              }}
                            >
                              <Icon icon="pen" />
                            </Chip.Button>
                          )

                          out.push(
                            <Chip.Button
                              variant="outlined"
                              disabled={layers_da.length == 1}
                              onClick={() => {
                                try {
                                  var { layers_da } = this.state

                                  if (layers_da.length > 1) {
                                    layers_da.splice(idxLayer, 1)
                                  }

                                  this.setState({
                                    layers_da: layers_da
                                  })
                                } catch (e) {
                                  alert(e)
                                }
                              }}
                            >
                              <Icon icon="trash" />
                            </Chip.Button>
                          )

                          out.push(
                            <Chip
                              theme={
                                (idxLayer == layers_da.length - 1 &&
                                  layers_da[idxLayer].layer_size != 1 &&
                                  'error') ||
                                'normal'
                              }
                            >
                              <Icon
                                icon="cozy"
                                style={{ marginRight: '0.5rem' }}
                              />{' '}
                              {(idxLayer == layers_da.length - 1 &&
                                layers_da[idxLayer].layer_size != 1 &&
                                'This layer is MDA. It should be of size 1') ||
                                `x${layers_da[idxLayer].layer_size}`}
                            </Chip>
                          )

                          var str = ''
                          for (
                            let idxJob = 0;
                            idxJob < layers_da[idxLayer].layer_job.length;
                            idxJob++
                          ) {
                            str =
                              str +
                              ' ' +
                              layers_da[idxLayer].layer_job[idxJob].title
                          }
                          if (str.split(' ').join('') != '') {
                            out.push(
                              <Chip theme="normal">
                                <Icon
                                  icon="gear"
                                  style={{ marginRight: '0.5rem' }}
                                />
                                <em>{str}</em>
                              </Chip>
                            )
                          }
                          out.push(br)
                        }
                        return out
                      } catch (e) {
                        alert(e)
                      }
                    })()}
                    <p>
                      <Chip.Button
                        theme="normal"
                        variant="outlined"
                        disabled={layers_da.length == 1}
                        onClick={() => {
                          var { layers_da } = this.state
                          layers_da.push({
                            layer_job: [
                              {
                                title: '',
                                func: { label: '', value: '' },
                                args: {}
                              }
                            ],
                            layer_size: 1
                          })

                          this.setState({
                            layers_da: layers_da,
                            selectedLayer: layers_da.length,
                            boolModal: true
                          })
                        }}
                      >
                        <Icon icon="plus" />
                      </Chip.Button>
                    </p>
                  </div>

                  {this.state.boolModal && (
                    <Modal
                      title={
                        (selectedLayer == layers_da.length &&
                          'Edit Main Data Aggregator') ||
                        `Edit Layer ${selectedLayer}`
                      }
                      secondaryAction={() => {
                        this.setState({ boolModal: false })
                      }}
                    >
                      <ModalContent>
                        <Label htmlFor="sizeLayer">
                          Number of servers that compute this layer
                        </Label>
                        <Input
                          id="sizeLayer"
                          type="number"
                          error={
                            selectedLayer == layers_da.length &&
                            layers_da[selectedLayer - 1].layer_size != 1
                          }
                          onChange={event => {
                            var { layers_da } = this.state
                            layers_da[selectedLayer - 1].layer_size =
                              event.target.value
                            this.setState({
                              layers_da: layers_da
                            })
                          }}
                          value={layers_da[selectedLayer - 1].layer_size}
                          min="1"
                          step="1"
                        />

                        <div>
                          <Accordion>{this.displayArgs()}</Accordion>
                        </div>
                      </ModalContent>
                    </Modal>
                  )}

                  <br />
                  <br />
                  <TipsAndHelp step={this.state.step} />
                </div>
              )) ||
              (step == 4 && (
                <div>
                  <h1>Save your query as...</h1>
                  <div>
                    <p>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Pretty name for a query"
                        value={name}
                        onChange={event => {
                          this.setState({ name: event.target.value })
                        }}
                      />
                    </p>

                    <Label htmlFor="idConcepts">Labels</Label>
                    <SelectBox
                      options={optionsLabels}
                      isMulti
                      id="idConcepts"
                      value={labels}
                      onChange={event => {
                        this.setState({ labels: event })
                      }}
                      components={{
                        Option: CheckboxOption
                      }}
                    />
                    <br />
                    <Checkbox
                      label="Encrypted query"
                      disabled
                      value={isEncrypted}
                      onChange={() => {
                        var { isEncrypted } = this.state
                        isEncrypted = !isEncrypted
                        this.setState({ isEncrypted: isEncrypted })
                      }}
                    />
                    <br />
                  </div>
                  <div>
                    <Button
                      label="Download Input as JSON"
                      type="button"
                      theme="secondary"
                      icon="download"
                      size="large"
                      onClick={() => {
                        window.open(
                          (
                            'data:application/json;charset=utf-8,' +
                            encodeURIComponent(
                              buildInputQuery(
                                this.state.localquery,
                                this.state.isEncrypted,
                                this.state.targetProfile,
                                this.state.layers_da,
                                this.state.limitedObs,
                                this.state.limit
                              )['data']
                            )
                          )
                            .split('%20')
                            .join('')
                        )
                      }}
                    />
                    <br />
                    <br />
                    <br />
                    <TipsAndHelp step={this.state.step} />
                  </div>
                </div>
              )) ||
              (step == 5 && (
                <center>
                  <div style={styles.empty}>
                    <Empty icon="cozy" title={titleMsg} text={msg} />
                  </div>
                </center>
              ))}
          </form>
        </div>
      )
    } catch (e) {
      alert(e)
    }
  }
}
export default withClient(NewQuery)
