import React, { Component } from 'react'
import { AccordionItem } from 'cozy-ui/react/Accordion'
import Field from 'cozy-ui/react/Field'
import Label from 'cozy-ui/react/Label'

const Input = require('cozy-ui/react/Input').default

const optionsTypeLayer = [
  { label: 'Sum', value: 'sum' },
  { label: 'Min', value: 'min' },
  { label: 'Max', value: 'max' },
  { label: 'Sum of squares', value: 'square_sum' }
]

export class AggregationFunction extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = this.props
  }

  onChange(func, args) {
    if (this.props.onChange) {
      this.props.onChange(func, args)
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
              this.onChange(event, this.props.json.args)
            }}
            placeholder="Select ..."
          />
        </div>
      )

      switch (json.func.value) {
        case 'sum':
        case 'squared_sum':
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
                    args.keys = event.target.value
                    this.onChange(this.props.json.func, args)
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
                    args.weight = event.target.value
                    this.onChange(this.props.json.func, args)
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
              <Label htmlFor="inputkey" block={false}>
                {'Key(s)'}
              </Label>
              <Input id="inputkey" placeholder="Choose a key..." />
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
          (json.func.label == '' && 'Please choose a function...') ||
          json.func.label
        }
      >
        {out}
      </AccordionItem>
    )
  }

  componentDidMount() {}
}

export default AggregationFunction
