import React, { Component } from 'react'

import AggregationFunction from './AggregationFunction'

import { withClient } from 'cozy-client'
import Accordion from 'cozy-ui/react/Accordion'
import Button from 'cozy-ui/react/Button'
import ButtonAction from 'cozy-ui/react/ButtonAction'
import Card from 'cozy-ui/react/Card'
import Checkbox from 'cozy-ui/react/Checkbox'
import Chip from 'cozy-ui/react/Chip'
import Empty from 'cozy-ui/react/Empty'
import Field from 'cozy-ui/react/Field'
import Label from 'cozy-ui/react/Label'
import Icon from 'cozy-ui/react/Icon'
import Infos from 'cozy-ui/react/Infos'
import Input from 'cozy-ui/react/Input'
import InputGroup from 'cozy-ui/react/InputGroup'
import SelectBox from 'cozy-ui/react/SelectBox'
import {
  templateQuery,
  templateLayer,
  templateFunc
} from 'assets/template_input_query.js'
import { QUERIES_DOCTYPE } from 'doctypes'

const CheckboxOption = require('cozy-ui/react/SelectBox').CheckboxOption
const md5 = require('md5.js')
const {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} = require('cozy-ui/react/Tabs')

const optionsDataset = [
  { label: 'io.cozy.bank.operations', value: 'io.cozy.bank.operations' }
]

const optionsConcept = [
  { value: 'diplome>cap', label: "Diplômé.e d'un CAP" },
  { value: 'diplome>bac', label: 'Diplômé.e du BAC' },
  { value: 'diplome>dut', label: "Diplômé.e d'un DUT" },
  { value: 'diplome>licence', label: "Diplômé.e d'une licence" },
  { value: 'diplome>master', label: "Diplômé.e d'un master" },
  { value: 'diplome>ingenieur', label: 'Diplômé.e en inégnierie' },
  { value: 'diplome>commerce', label: 'Diplômé.e en commerce' },
  { value: 'diplome>doctorat', label: "Diplômé.e d'un doctorat" },
  { value: 'imc>maigreur', label: 'IMC : Maigre' },
  { value: 'imc>normal', label: 'IMC : Normal' },
  { value: 'imc>surpoids', label: 'IMC : Surpoids' },
  { value: 'imc>obesite-moderee', label: 'IMC : Obésité modérée' },
  { value: 'imc>obesite-severe', label: 'IMC : Obésité sévère' },
  { value: 'imc>obesite-morbide', label: 'IMC : Obésité morbide' },
  { value: 'maladie>alzheimer', label: "Atteint d'Alzheimer" },
  { value: 'maladie>cancer', label: "Atteint d'un cancer" },
  { value: 'maladie>diabete', label: 'Atteint de diabète' },
  { value: 'maladie>parkinson', label: "Atteint d'un Parkinson" },
  { value: 'maladie>sida', label: 'Atteint du SIDA' },
  { value: 'loc-travail>paris', label: 'Travail à Paris' },
  { value: 'loc-travail>lille', label: 'Travail à Lille' },
  { value: 'loc-travail>rennes', label: 'Travail à Rennes' },
  { value: 'loc-travail>saint-etienne', label: 'Travail à Saint-Etienne' }
]

const optionsLabels = [
  { label: 'Work', value: 'work' },
  { label: 'Health', value: 'health' },
  { label: 'Finance', value: 'finance' }
]

const styles = {
  empty: {
    position: 'relative',
    transform: 'translateZ(0)',
    height: '500px',
    display: 'flex'
  }
}

function buildInputQuery(
  localquery,
  isEncrypted,
  targetProfile,
  layers_da,
  limit
) {
  // This function is going to inject string into a stringified json imported from template_input_query
  var jsonConcept = ''
  var jsonLayers = ''
  var jsonPsdConcept = ''
  var jsonTargetProfile = targetProfile.split('"').join('\\"')
  var jsonLayerArgs = ''
  var jsonFunc = ''

  // Extract an array of Concpets from the targetProfile
  var concepts = targetProfile
    .split(')OR')
    .join(':')
    .split(')AND')
    .join(':')
    .split('OR')
    .join('')
    .split('AND')
    .join('')
    .split('(')
    .join('')
    .split(')')
    .join('')
    .split(':')

  var i = 0
  var pseudoConcept = new Map()
  var conceptID
  var conceptPseudoAnonymized
  while (i < concepts.length) {
    // e.g. concepts[i]=conceptID="work>Paris"
    conceptID = concepts[i]
    conceptPseudoAnonymized = new md5().update('concepts' + i).digest('hex')

    // Add concept to jsonConcept
    jsonConcept = jsonConcept + '"' + conceptID + '",'

    // Add conceptPseudoAnonymized to pseudoConcept
    pseudoConcept.set(conceptID, conceptPseudoAnonymized)

    // Replace concept with pseudo-anonymised concept
    jsonTargetProfile = jsonTargetProfile
      .split(concepts[i])
      .join(conceptPseudoAnonymized)
    i = i + 1
  }

  // Delete the final ',' from jsonConcept
  jsonConcept = jsonConcept.substring(0, jsonConcept.length - 1)

  for (let [key, value] of pseudoConcept) {
    jsonPsdConcept = jsonPsdConcept + '"' + key + '":"' + value + '",'
  }
  jsonPsdConcept = jsonPsdConcept.substring(0, jsonPsdConcept.length - 1)

  // build jsonLayers from layers_da
  i = 0
  var j = 0
  while (i < layers_da.length) {
    j = 0
    jsonFunc = ''

    // Build jsonFunc for each function
    while (j < layers_da[i].layer_job.length) {
      jsonLayerArgs =
        '"keys":["' +
        layers_da[i].layer_job[j].args.keys
          .split(' ')
          .join('')
          .split(',')
          .join('","') +
        '"]'

      // check if weight is specified. If yes, add it to jsonLayers
      if (
        layers_da[i].layer_job[j].args.weight != null &&
        layers_da[i].layer_job[j].args.weight != '' &&
        layers_da[i].layer_job[j].args.weight != ' '
      ) {
        jsonLayerArgs =
          jsonLayerArgs +
          ',"weight":"' +
          layers_da[i].layer_job[j].args.weight +
          '"'
      }

      jsonFunc =
        jsonFunc +
        templateFunc
          .replace('//FUNC//', layers_da[i].layer_job[j].func.value)
          .replace('//ARGS//', jsonLayerArgs) +
        ','

      j++
    }
    // Delete the final ',' from jsonFunc
    jsonFunc = jsonFunc.substring(0, jsonFunc.length - 1)

    jsonLayers =
      jsonLayers +
      templateLayer
        .replace('//FUNCS//', jsonFunc)
        .replace('//SIZE//', layers_da[i].layer_size) +
      ','

    i++
  }
  // Delete the final ',' from jsonLayers
  jsonLayers = jsonLayers.substring(0, jsonLayers.length - 1)

  // Build Query
  var stringQuery = templateQuery
    .replace('//CONCEPT//', jsonConcept)
    .replace('//PSD-CONCEPT//', jsonPsdConcept)
    .replace('//LAYERS//', jsonLayers)
    .replace('//DOCTYPE//', localquery.value)
    .replace('//OPERATION//', jsonTargetProfile)
    .replace('//ENCRYPTED//', isEncrypted)
    .replace('//LIMIT//', limit)

  // Remote body need to be map[string]string
  // It's an association between var name and value
  // Vars are defined in remote-doctypes
  // In our case, stringQuery is called "data"
  return { data: stringQuery }
}

export class NewQuery extends Component {
  constructor(props, context) {
    super(props, context)

    // initial component state
    this.state = {
      selectedLayer: 1,
      localquery: {
        label: 'io.cozy.bank.operations',
        value: 'io.cozy.bank.operations'
      },
      layers_da: [
        {
          layer_job: [
            {
              title: 'SUM(AMOUNT)',
              func: { label: 'Sum', value: 'sum' },
              args: { keys: 'amount', weight: '' }
            },
            {
              title: 'SUM OF SQUARES(AMOUNT)',
              func: { label: 'Sum of squares', value: 'sum_square' },
              args: {
                weight: '',
                keys: 'amount'
              }
            }
          ],
          layer_size: 6
        },
        {
          layer_job: [
            {
              title: 'SUM(SUM_AMOUNT, SUM_SQUARE_AMOUNT, LENGTH)',
              func: { label: 'Sum', value: 'sum' },
              args: {
                weight: '',
                keys: 'sum_amount, sum_square_amount, length'
              }
            }
          ],
          layer_size: 1
        }
      ],
      isEncrypted: false,
      labels: [{ label: 'Finance', value: 'finance' }],
      limit: 1000,
      tabTargetProfile: [
        'OR(',
        'OR(',
        'loc-travail>paris',
        ':',
        'loc-travail>lille',
        ')',
        'OR(',
        'loc-travail>saint-etienne',
        ':',
        'loc-travail>rennes',
        ')',
        ')'
      ],
      targetProfile:
        'OR(OR(loc-travail>paris:loc-travail>lille)OR(loc-travail>saint-etienne:loc-travail>rennes))',
      isWorking: false,
      isFinished: false,
      name: "Sum of operations' amount",
      titleMsg: 'The query is running',
      msg: 'Go to "Saved Queries" to follow it'
    }

    this.demoState = this.state

    this.state = {
      selectedLayer: 1,
      localquery: null,
      layers_da: [
        {
          layer_job: [{ title: '', func: { label: '', value: '' }, args: {} }],
          layer_size: 1
        }
      ],
      tabTargetProfile: [],
      isEncrypted: true,
      labels: [],
      limit: 1000,
      targetProfile: '',
      isWorking: false,
      isFinished: false,
      name: ''
    }

    this.initialState = this.state
  }

  demo = () => {
    this.setState(() => this.demoState)
  }

  // create the new query
  handleSubmit = async () => {
    const { client } = this.props
    const {
      localquery,
      isEncrypted,
      targetProfile,
      labels,
      limit,
      layers_da,
      name
    } = this.state

    // reset the input and display a spinner during the process
    this.setState(() => ({ isWorking: true, isFinished: false }))
    var success = false

    // build the body of the http request
    try {
      var body = buildInputQuery(
        localquery,
        isEncrypted,
        targetProfile,
        layers_da,
        limit
      )
      success = true
    } catch (e) {
      this.setState(() => ({
        isWorking: false,
        isFinished: true,
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
                status: 'Running',
                name: name,
                queryid: response['query_id']
              })
              this.setState(() => ({
                isWorking: false,
                isFinished: true,
                titleMsg: 'The query is running',
                msg: 'Go to "Saved Queries" to follow it'
              }))
            } catch (err) {
              this.setState(() => ({
                isWorking: false,
                isFinished: true,
                titleMsg: 'Error while saving query on your database',
                msg: err.toString()
              }))
            }
          })
          .catch(error => {
            this.setState(() => ({
              isWorking: false,
              isFinished: true,
              titleMsg: 'Cozy-DISPERS returned an error',
              msg: error.toString()
            }))
          })
      } catch (e) {
        this.setState(() => ({
          isWorking: false,
          isFinished: true,
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
        isFinished: true,
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

    try {
      const { layers_da, selectedLayer } = this.state
      out.push(<Label htmlFor="func0">{'Aggregation function(s)'}</Label>)
      out.push(
        <Infos
          text="Ordered from the first executed to the last one"
          icon="info"
        />
      )
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
      selectedLayer,
      isEncrypted,
      targetProfile,
      isWorking,
      isFinished,
      limit,
      conceptSelector,
      labels,
      name,
      titleMsg,
      msg
    } = this.state

    const isLastLayer = selectedLayer == layers_da.length

    return (
      <div>
        {isFinished ? (
          <center>
            <div>
              <div style={styles.empty}>
                <Empty icon="cozy" title={titleMsg} text={msg} />
              </div>
            </div>
          </center>
        ) : (
          <div>
            <form onSubmit={this.handleSubmit}>
              <p>
                <ButtonAction
                  label="Demo"
                  rightIcon="new"
                  onClick={this.demo}
                />
                <ButtonAction
                  type="error"
                  label="Reset form"
                  onClick={this.reset}
                  rightIcon="file-none"
                />
              </p>
              <br />
              <Tabs initialActiveTab="targets">
                <TabList>
                  <Tab name="targets">Define targets</Tab>
                  <Tab name="t">Query targets</Tab>
                  <Tab name="da">Aggregate data</Tab>
                  <Tab name="general">Run Query</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel name="targets">
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
                          label=":"
                          type="button"
                          theme="secondary"
                          onClick={() => {
                            var { tabTargetProfile } = this.state
                            tabTargetProfile.push(':')
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
                                tabTargetProfile.push(conceptSelector.value)
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

                    <Card>
                      <p
                        style={{
                          fontSize:
                            30 + 150 / (targetProfile.length + 1) + 'pt',
                          color: '#484848'
                        }}
                      >
                        {targetProfile}
                      </p>
                    </Card>

                    <Infos
                      title="How to build your target profile"
                      icon="info"
                      text="Use the following tools to create your target profile. Example of TP
                        : OR(maladie>sida:maladie>diabete)"
                    />
                  </TabPanel>
                  <TabPanel name="t">
                    <Field
                      label="Choose one Doctype"
                      type="select"
                      value={localquery}
                      onChange={event => {
                        this.setState({ localquery: event })
                      }}
                      options={optionsDataset}
                      placeholder="Select ..."
                    />

                    <Label htmlFor="limit" style={{ marginRight: '3px' }}>
                      Maximum of values retrieved from each Cozy
                    </Label>
                    <Input
                      id="limit"
                      type="number"
                      onChange={event => {
                        this.setState({ limit: event.target.value })
                      }}
                      value={limit}
                      min="1"
                      max="1000000"
                      step="1"
                    />
                  </TabPanel>
                  <TabPanel name="da">
                    <p>
                      <Chip theme="primary">
                        <Icon icon="stack" style={{ marginRight: '0.5rem' }} />
                        {layers_da.length} layer(s) in total
                      </Chip>
                      <ButtonAction
                        label="Add layer"
                        rightIcon="plus"
                        onClick={() => {
                          var { layers_da } = this.state
                          layers_da.push({
                            layer_job: [
                              {
                                args: []
                              }
                            ],
                            layer_size: 1
                          })
                          this.setState({
                            layers_da: layers_da
                          })
                        }}
                      />
                      <ButtonAction
                        type="error"
                        label="Remove last layer"
                        onClick={() => {
                          var { layers_da, selectedLayer } = this.state
                          if (selectedLayer == layers_da.length) {
                            selectedLayer = selectedLayer - 1
                          }
                          layers_da.splice(-1, 1)
                          this.setState({
                            layers_da: layers_da,
                            selectedLayer: selectedLayer
                          })
                        }}
                        rightIcon="file-none"
                      />
                    </p>
                    <Card
                      style={{
                        marginLeft: '20%',
                        marginRight: '20%'
                      }}
                    >
                      <center>
                        <p>
                          <div>
                            <Chip.Button
                              variant="outlined"
                              onClick={() => {
                                var { selectedLayer } = this.state
                                if (selectedLayer > 1) {
                                  selectedLayer = selectedLayer - 1
                                }
                                this.setState({ selectedLayer: selectedLayer })
                              }}
                            >
                              <Icon icon="left" />
                            </Chip.Button>
                            <Chip>
                              <Icon
                                icon="stack"
                                style={{ marginRight: '0.5rem' }}
                              />
                              Layer {selectedLayer}
                            </Chip>
                            <Chip.Button
                              variant="outlined"
                              onClick={() => {
                                var { selectedLayer, layers_da } = this.state
                                if (selectedLayer < layers_da.length) {
                                  selectedLayer = selectedLayer + 1
                                }
                                this.setState({ selectedLayer: selectedLayer })
                              }}
                            >
                              <Icon icon="right" />
                            </Chip.Button>
                          </div>
                        </p>
                      </center>
                      <Label htmlFor="layer">Parallel computation</Label>
                      <Input
                        type="number"
                        id="layer"
                        value={layers_da[selectedLayer - 1].layer_size}
                        onChange={event => {
                          const { layers_da } = this.state
                          layers_da[selectedLayer - 1].layer_size =
                            event.target.value
                          this.setState({ layers_da: layers_da })
                        }}
                        min="1"
                        max={isLastLayer ? 1 : 100}
                        step="1"
                      />
                      <br />
                      <br />

                      <Accordion>{this.displayArgs()}</Accordion>

                      <br />
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
                      <ButtonAction
                        type="error"
                        rightIcon="trash"
                        label="Remove last function"
                        onClick={() => {
                          var { layers_da, selectedLayer } = this.state
                          layers_da[selectedLayer - 1].layer_job.splice(-1, 1)
                          this.setState({
                            layers_da: layers_da
                          })
                        }}
                      />
                    </Card>
                  </TabPanel>
                  <TabPanel name="general">
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
                        value={isEncrypted}
                        onChange={() => {
                          var { isEncrypted } = this.state
                          isEncrypted = !isEncrypted
                          this.setState({ isEncrypted: isEncrypted })
                        }}
                      />
                    </div>
                    <br />
                    <Button
                      onClick={this.submit}
                      type="submit"
                      busy={isWorking}
                      label="Run"
                      size="large"
                      extension="narrow"
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </form>
          </div>
        )}
      </div>
    )
  }
}

export default withClient(NewQuery)
