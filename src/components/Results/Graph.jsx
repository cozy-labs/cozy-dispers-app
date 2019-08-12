import React, { Component } from 'react'

import Chart from 'chart.js'

export class StepDurations extends Component {
  constructor(props, context) {
    super(props, context)
    this.Canvas = React.createRef()
  }

  render() {
    return <canvas ref={this.Canvas} width="400" height="200"></canvas>
  }

  componentDidMount() {
    const { training } = this.props
    try {
      var times = []
      var labels = []
      times.push(new Date(training.state.ExecutionMetadata.start).getTime())

      var tasks = [
        'DecryptConcept',
        'FetchListsOfAddresses',
        'SelectTargets',
        'LocalQuery'
      ]
      for (var i = 0; i < tasks.length; i++) {
        var tmp = new Date(
          training.state.ExecutionMetadata.tasks[tasks[i]].end
        ).getTime()
        if (tmp != -62135596800000) {
          times.push(tmp)
          labels.push(tasks[i])
        }
      }

      for (i = 0; i < training['layers_da'].length; i++) {
        var last = training['layers_da'][i]['layer_size'] - 1
        tmp = new Date(
          training.state.ExecutionMetadata.tasks['da' + i + '-' + last].end
        ).getTime()
        if (tmp != -62135596800000) {
          times.push(tmp)
          labels.push('Layer ' + i)
        }
      }

      var durations = []
      for (i = 0; i < times.length - 1; i++) {
        durations.push(times[i + 1] - times[i])
      }

      var myBarChart = new Chart(this.Canvas.current.getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Execution duration (ms)',
              data: durations,
              hoverBackgroundColor: '#297ef2',
              hoverBorderColor: '#297ef2',
              backgroundColor: '#297ef2',
              borderColor: '#297ef2'
            }
          ]
        }
      })

      myBarChart.draw()
    } catch (e) {
      alert(e)
    }
  }
}

export default StepDurations
