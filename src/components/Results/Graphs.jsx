import React, { Component } from 'react'

import Chart from 'chart.js'

export class StepDurations extends Component {
  constructor(props, context) {
    super(props, context)
    this.Canvas = React.createRef()
  }

  render() {
    return <canvas ref={this.Canvas} width="200" height="150"></canvas>
  }

  componentDidMount() {
    const { query } = this.props
    try {
      var times = []
      var labels = []
      var tmp = new Date(query.state.ExecutionMetadata.start)
      times.push(tmp.getTime())

      var tasks = [
        'DecryptConcept',
        'FetchListsOfAddresses',
        'SelectTargets',
        'LocalQuery'
      ]
      for (var i = 0; i < query['layers_da'].length; i++) {
        tasks.push('LaunchLayer' + i)
      }

      for (i = 0; i < tasks.length; i++) {
        tmp = new Date(
          query.state.ExecutionMetadata.tasks[tasks[i]].end
        ).getTime()
        if (tmp != -62135596800000) {
          times.push(tmp)
          labels.push(tasks[i])
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
        },
        options: {
          title: {
            display: true,
            text: 'Temporal distribution of tasks'
          }
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
    return <canvas ref={this.Camembert} width="150" height="150"></canvas>
  }

  componentDidMount() {
    const { query } = this.props
    try {
      var communication = 0
      var computation = 0
      var tmp2 = query.state.ExecutionMetadata.tasks['DecryptConcept']
      var tmp = query.state.ExecutionMetadata
      var conductor =
        new Date(tmp2.start).getTime() - new Date(tmp.start).getTime()

      var tasks = [
        'DecryptConcept',
        'FetchListsOfAddresses',
        'SelectTargets',
        'LocalQuery'
      ]

      for (var i = 0; i < tasks.length; i++) {
        tmp2 = query.state.ExecutionMetadata.tasks['LaunchLayer0']
        tmp = query.state.ExecutionMetadata.tasks[tasks[i]]

        if (i < tasks.length - 1) {
          tmp2 = query.state.ExecutionMetadata.tasks[tasks[i + 1]]
          conductor =
            conductor +
            new Date(tmp2.start).getTime() -
            new Date(tmp.end).getTime()
        } else {
          conductor =
            conductor +
            new Date(tmp2.end).getTime() -
            new Date(tmp.end).getTime()
        }

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
        } else {
          computation =
            computation +
            new Date(tmp.end).getTime() -
            new Date(tmp.start).getTime()
        }
      }

      for (i = 1; i < query['layers_da'].length; i++) {
        tmp = query.state.ExecutionMetadata.tasks['LaunchLayer' + i]
        conductor =
          conductor +
          new Date(tmp.end).getTime() -
          new Date(tmp.start).getTime()
      }

      for (i = 0; i < query.state.AsyncMetadata.length; i++) {
        tmp = query.state.AsyncMetadata[i]
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
        } else {
          computation =
            computation +
            new Date(tmp.end).getTime() -
            new Date(tmp.start).getTime()
        }
      }

      var myDoughtNutChart = new Chart(
        this.Camembert.current.getContext('2d'),
        {
          type: 'doughnut',
          data: {
            labels: ['communication', 'computation', 'conductor'],
            datasets: [
              {
                label: 'Time (ms)',
                backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f'],
                data: [communication, computation, conductor]
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: 'Duration of the steps'
            }
          }
        }
      )
      myDoughtNutChart.draw()
    } catch (e) {
      alert(e)
    }
  }
}
