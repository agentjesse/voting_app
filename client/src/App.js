import React, { Component } from 'react'
import Chart from './Chart'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      response: ''
    }
  }

  componentDidMount() {
    // this.callApi()
    //   .then(res => this.setState({ response: res.express }))
    //   .catch(err => console.log(err))
  }

  // callApi = async ()=> {
  //   const response = await fetch('/api/hello')
  //   const body = await response.json()
  //   if (response.status !== 200) throw Error(body.message)
  //   return body
  // }


  render() {
    return (
      <div className="App">
        {/* <p>{this.state.response}</p> */}
        <Chart />
      </div>
    )
  }
}

export default App
