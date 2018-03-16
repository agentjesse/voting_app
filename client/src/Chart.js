import React, { Component } from 'react'
const randomColor = require('randomcolor')

//note this component cant be named Chart because it would interfere with the global of same name.
class MyChart extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  //never rerender this component
  shouldComponentUpdate() { return false }

  //the refs system will call this function when the element has rendered. and this will occur before lifecycle method componentDidMount/componentDidUpdate
  makeChart(canvas){
    //eslint-disable-next-line
    const myDoughnutChart = new Chart( canvas, { //Chart here comes from the global import
      type: 'doughnut',
      data: {
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ['option1','option2','option3','option4','option5','option6'],
        datasets: [
          {
            data: [10, 10, 10,10,20,40],
            backgroundColor: randomColor( {luminosity: 'light', count:6} ) //returns array of 6 colors
          }
        ]
      }
      
    })
  }

  //ref system used to save a direct refrence to a dom element
  render() {
    return (
      <div style={ {position: 'relative', width:'100%' } }>
        <canvas ref={ canvas => this.makeChart(canvas) }></canvas>
      </div>
    )
  }
  
}

export default MyChart
