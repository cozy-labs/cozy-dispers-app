import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import Input from 'cozy-ui/react/Input'
import Icon from 'cozy-ui/react/Icon'
import InputGroup from 'cozy-ui/react/InputGroup'
import Label from 'cozy-ui/react/Label'
import Button from 'cozy-ui/react/Button'
import ButtonAction from 'cozy-ui/react/ButtonAction'
import Card from 'cozy-ui/react/Card'
import Field from 'cozy-ui/react/Field'
import Checkbox from 'cozy-ui/react/Checkbox'
import SelectBox from 'cozy-ui/react/SelectBox'
import Empty from 'cozy-ui/react/Empty'
import { templateQuery, templateLayer } from 'assets/template_input_query.js'
import { QUERIES_DOCTYPE } from 'doctypes'

const CheckboxOption = require('cozy-ui/react/SelectBox').CheckboxOption
const { Bold } = require('cozy-ui/react/Text')
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
  { value: 'travail>paris', label: 'Travail à Paris' },
  { value: 'travail>lille', label: 'Travail à Lille' },
  { value: 'travail>saint-etienne', label: 'Travail à Saint-Etienne' },
  { value: 'travail>rennes', label: 'Travail à Rennes' },
  { value: 'manger>poisson', label: 'Mange du poisson' },
  { value: 'aime>danse', label: 'Aime la danse' },
  { value: 'manger>riz', label: 'Mange du riz' },
  { value: 'manger>viande', label: 'Mange de la viande' },
  { value: 'aime>foot', label: 'Aime le foot' },
  { value: 'aime>peche', label: 'Aime la pêche' }
]

const optionsTypeLayer = [{ label: 'Weighted Sum', value: 'LayerSum' }]

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

function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].label === nameKey) {
      return myArray[i]
    }
  }
}

function buildInputQuery(localquery, isEncrypted, targetProfile, layers_da) {
  // This function is going to inject string into a stringified json imported from template_input_query
  var jsonConcept = ''
  var jsonLayers = ''
  var jsonPsdConcept = ''
  var jsonTargetProfile = targetProfile.split('"').join('\\"')
  var jsonLayerArgs = ''

  // Extract an array of Concpets from the targetProfile
  var concepts = targetProfile
    .split('::')
    .join(':')
    .split('OR')
    .join('')
    .split('AND')
    .join('')
    .split('(')
    .join('')
    .split(')')
    .join('')
    .split('"')
    .join('')
    .split(':')

  var i = 0
  var pseudoConcept = new Map()
  var conceptID
  var conceptPseudoAnonymized
  while (i < concepts.length) {
    // e.g. concepts[i]="Work in Paris" conceptID="work>Paris"
    conceptID = search(concepts[i], optionsConcept).value
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
  while (i < layers_da.length) {
    jsonLayerArgs =
      '"keys":["' +
      layers_da[i].layer_job.args.keys.split(',').join('","') +
      '"]'

    // check if weight is specified. If yes, add it to jsonLayers
    if (layers_da[i].layer_job.args.weight != null) {
      jsonLayerArgs =
        jsonLayerArgs + ',"weight":"' + layers_da[i].layer_job.args.weight + '"'
    }

    jsonLayers =
      jsonLayers +
      templateLayer
        .replace('//FUNC//', layers_da[i].layer_job.func.value)
        .replace('//ARGS//', jsonLayerArgs)
        .replace('//SIZE//', layers_da[i].layer_size)
    jsonLayers = jsonLayers + ','
    i = i + 1
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
      numberOfLayers: 2,
      selectedLayer: 1,
      localquery: {
        label: 'io.cozy.bank.operations',
        value: 'io.cozy.bank.operations'
      },
      layers_da: [
        {
          layer_job: {
            func: { label: 'Weighted Sum', value: 'sum' },
            args: { keys: 'amount' }
          },
          layer_size: 4
        },
        {
          layer_job: {
            func: { label: 'Weighted Sum', value: 'sum' },
            args: {
              weight: 'length',
              keys: 'amount'
            }
          },
          layer_size: 1
        }
      ],
      isEncrypted: false,
      labels: [{ label: 'Finance', value: 'finance' }],
      targetProfile:
        'OR(OR("Travail à Paris"::"Travail à Lille"):OR("Travail à Saint-Etienne"::"Travail à Rennes"))',
      isWorking: false,
      isFinished: false,
      name: "Mean of operations' amount",
      titleMsg: 'The query is running',
      msg: 'Go to "Saved Queries" to follow it'
    }

    this.initialState = this.state
  }

  demo = () => {
    this.setState(() => this.initialState)
  }

  // create the new query
  handleSubmit = async () => {
    const { client } = this.props
    const {
      localquery,
      isEncrypted,
      targetProfile,
      labels,
      layers_da,
      name
    } = this.state

    // reset the input and display a spinner during the process
    this.setState(() => ({ isWorking: true, isFinished: false }))

    // build the body of the http request
    try {
      var body = buildInputQuery(
        localquery,
        isEncrypted,
        targetProfile,
        layers_da
      )
    } catch (e) {
      this.setState(() => ({
        isWorking: false,
        isFinished: true,
        titleMsg: 'Error',
        msg: e.toString()
      }))
    }

    try {
      client.stackClient
        .fetchJSON('POST', '/remote/cc.cozycloud.dispers.query', body)
        .then(async response => {
          var json = JSON.stringify(response)
          try {
            await client.create(QUERIES_DOCTYPE, {
              localquery: localquery,
              isEncrypted: isEncrypted,
              targetProfile: targetProfile,
              labels: labelsToAdd,
              layers_da: layers_da,
              status: 'Running',
              name: name,
              queryid: json['queryid']
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

  reset = () => {
    this.setState(() => ({
      numberOfLayers: 1,
      selectedLayer: 1,
      localquery: null,
      layers_da: [
        {
          layer_job: {
            args: []
          },
          layer_size: 1
        }
      ],
      isEncrypted: true,
      labels: [],
      targetProfile: '',
      isWorking: false,
      isFinished: false,
      name: ''
    }))
  }

  render() {
    const {
      localquery,
      layers_da,
      numberOfLayers,
      selectedLayer,
      isEncrypted,
      targetProfile,
      isWorking,
      isFinished,
      labels,
      name,
      titleMsg,
      msg
    } = this.state

    const isLastLayer = selectedLayer == numberOfLayers

    while (layers_da.length < numberOfLayers) {
      layers_da.push({ layer_job: {}, layer_size: 1 })
    }

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
            <h1>Build a new query</h1>
            <form onSubmit={this.handleSubmit}>
              <p>
                <ButtonAction
                  label="Demo"
                  rightIcon="openwith"
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
                    <Field
                      id="idField"
                      label="Target Profile"
                      type="textarea"
                      value={targetProfile}
                      placeholder="Select..."
                      onChange={event => {
                        this.setState({ targetProfile: event.target.value })
                      }}
                      size="medium"
                    />
                    <Label htmlFor="idConcepts" style={{ marginRight: '3px' }}>
                      <Icon icon="cozy" /> Available Concepts
                    </Label>
                    <SelectBox options={optionsConcept} id="idConcepts" />
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
                  </TabPanel>
                  <TabPanel name="da">
                    <p>
                      <Label htmlFor="idNumberlayer">Number of layers</Label>
                      <Input
                        type="number"
                        placeholder="Select..."
                        id="idNumberlayer"
                        value={numberOfLayers}
                        onChange={event => {
                          this.setState({ numberOfLayers: event.target.value })
                        }}
                        min="1"
                        max="100"
                        step="1"
                      />
                    </p>
                    <Card>
                      <p>
                        <Label htmlFor="idNumberlayer">Select layer</Label>
                        <Input
                          type="number"
                          placeholder="Select..."
                          id="idNumberlayer"
                          value={selectedLayer}
                          onChange={event => {
                            this.setState({ selectedLayer: event.target.value })
                          }}
                          min="0"
                          max={numberOfLayers}
                          step="1"
                        />
                      </p>
                      <Label htmlFor="layer">Size</Label>
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
                      <Field
                        label="Aggregation Function"
                        type="select"
                        options={optionsTypeLayer}
                        placeholder="Select ..."
                        value={layers_da[selectedLayer - 1].layer_job.func}
                        onChange={event => {
                          const { selectedLayer, layers_da } = this.state
                          layers_da[selectedLayer - 1].layer_job.func = event
                          this.setState({ layers_da: layers_da })
                        }}
                      />
                      <InputGroup
                        prepend={<Bold className="u-pl-1">Keys </Bold>}
                      >
                        <Input
                          placeholder="Value"
                          value={
                            layers_da[selectedLayer - 1].layer_job.args.keys
                          }
                          onChange={event => {
                            var { selectedLayer, layers_da } = this.state
                            layers_da[selectedLayer - 1].layer_job.args.keys =
                              event.target.value
                            this.setState({ layers_da: layers_da })
                          }}
                        />
                      </InputGroup>
                      <br />
                      <InputGroup
                        prepend={<Bold className="u-pl-1">Weight </Bold>}
                      >
                        <Input
                          placeholder="Value"
                          value={
                            layers_da[selectedLayer - 1].layer_job.args.weight
                          }
                          onChange={event => {
                            var { selectedLayer, layers_da } = this.state
                            layers_da[selectedLayer - 1].layer_job.args.weight =
                              event.target.value
                            this.setState({ layers_da: layers_da })
                          }}
                        />
                      </InputGroup>
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
