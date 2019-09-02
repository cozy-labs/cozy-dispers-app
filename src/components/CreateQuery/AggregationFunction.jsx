import React, { Component } from 'react'
import { AccordionItem } from 'cozy-ui/react/Accordion'
import Field from 'cozy-ui/react/Field'
import Label from 'cozy-ui/react/Label'

const Input = require('cozy-ui/react/Input').default

const optionsTypeLayer = [
  { label: 'Sum', value: 'sum' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Sum of squares', value: 'sum_square' }
]

export class AggregationFunction extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = this.props
  }

  onChange(func, args, title) {
    if (this.props.onChange) {
      this.props.onChange(func, args, title)
    }
  }

  render() {
    const br = <br />
    var { json } = this.props
    var out = []

    try {
      out.push(
        <div>
          <Field
            label="Aggregation function"
            type="select"
            options={optionsTypeLayer}
            value={json.func}
            onChange={event => {
              this.onChange(event, this.props.json.args, '')
            }}
            placeholder="Select ..."
          />
        </div>
      )

      switch (json.func.value) {
        case 'sum':
        case 'sum_square':
          out.push(
            <div>
              <p>
                <Label htmlFor="inputkey" block={false}>
                  {'Key(s)'}
                </Label>
                <Input
                  id="inputkey"
                  placeholder="Choose key(s)..."
                  value={json.args.keys}
                  onChange={event => {
                    var args = this.props.json.args
                    var title = ''
                    args.keys = event.target.value
                    if (
                      args.weight == null ||
                      args.weight == '' ||
                      args.weight.length < 2
                    ) {
                      title = this.props.json.func.label + '(' + args.keys + ')'
                    } else {
                      title =
                        this.props.json.func.label +
                        '((' +
                        args.keys +
                        ')*' +
                        args.weight +
                        ')'
                    }
                    this.onChange(this.props.json.func, args, title)
                  }}
                />
              </p>
              <p>
                <Label htmlFor="inputkey" block={false}>
                  Weight
                </Label>
                <Input
                  id="inputkey"
                  placeholder="Choose a key..."
                  value={json.args.weight}
                  onChange={event => {
                    var args = this.props.json.args
                    var title = ''
                    args.weight = event.target.value
                    if (
                      args.weight == null ||
                      args.weight == '' ||
                      args.weight.length < 2
                    ) {
                      title = this.props.json.func.label + '(' + args.keys + ')'
                    } else {
                      title =
                        this.props.json.func.label +
                        '((' +
                        args.keys +
                        ')*' +
                        args.weight +
                        ')'
                    }
                    this.onChange(this.props.json.func, args, title)
                  }}
                />
              </p>
            </div>
          )
          break
        case 'min':
        case 'max':
          out.push(
            <div>
              <p>
                <Label htmlFor="inputkey" block={false}>
                  Weight
                </Label>
                <Input
                  id="inputkey"
                  placeholder="Choose a key..."
                  value={json.args.weight}
                  onChange={event => {
                    var args = this.props.json.args
                    var title = ''
                    args.keys = event.target.value
                    title = this.props.json.func.label + '(' + args.keys + ')'
                    this.onChange(this.props.json.func, args, title)
                  }}
                />
              </p>
            </div>
          )
          break
        case 'logit_map':
          // code block
          break
        case 'logit_reduce':
          // code block
          break
        case 'logit_update_weight':
          // code block
          break
        default:
        // code block
      }
    } catch (e) {
      alert(e)
    }

    out.push(br)
    out.push(br)
    out.push(br)
    out.push(br)
    out.push(br)
    out.push(br)
    out.push(br)
    out.push(br)

    return (
      <AccordionItem
        label={
          (json.title == '' && 'Please choose a function...') ||
          json.title.toUpperCase()
        }
      >
        {out}
      </AccordionItem>
    )
  }

  componentDidMount() {}
}

export default AggregationFunction
