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
        'Decrypt Concept',
        'Fetch Lists of Addresses',
        'Select Targets',
        'Local Query'
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
      //alert(e)
    }
  }
}

export class TimeDistribution extends Component {
  constructor(props, context) {
    super(props, context)
    this.Camembert = React.createRef()
  }

  render() {
    return <canvas ref={this.Camembert} width="400" height="200"></canvas>
  }

  componentDidMount() {
    const { training } = this.props
    try {
      var communication = 0
      var computation = 0
      var conductor = 0
      var executionDuration =
        new Date(training.state.ExecutionMetadata.end).getTime() -
        new Date(training.state.ExecutionMetadata.start).getTime()

      var tasks = [
        //'Decrypt Concept',
        'Fetch Lists of Addresses',
        'Select Targets',
        'Local Query'
      ]
      for (var i = 0; i < training['layers_da'].length; i++) {
        for (var j = 0; j < training['layers_da'][i]['layer_size']; j++) {
          tasks.push('da' + i + '-' + j)
        }
      }

      for (i = 0; i < tasks.length; i++) {
        var tmp = training.state.ExecutionMetadata.tasks[tasks[i]]
        if (new Date(tmp.arrival).getTime() != -62135596800000) {
          communication =
            communication +
            new Date(tmp.end).getTime() -
            new Date(tmp.returning).getTime()
          computation =
            computation +
            new Date(tmp.returning).getTime() -
            new Date(tmp.arrival).getTime()
          communication =
            communication +
            new Date(tmp.arrival).getTime() -
            new Date(tmp.start).getTime()
        }
      }

      conductor = executionDuration - communication - computation

      var myDoughtNutChart = new Chart(
        this.Camembert.current.getContext('2d'),
        {
          type: 'doughnut',
          data: {
            labels: ['communication', 'computation', 'conductor'],
            datasets: [
              {
                data: [communication, computation, conductor]
              }
            ]
          }
        }
      )
      myDoughtNutChart.draw()
    } catch (e) {
      //alert(e)
    }
  }
}
