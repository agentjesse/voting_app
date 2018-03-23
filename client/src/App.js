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
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err))
  }

  callApi = async ()=> {
    const response = await fetch('/api/hello') //this will pass through the proxy for sure. not sure about browser based url requests...maybe react-router will handle because port 3000 is forced there?
    const body = await response.json()
    if (response.status !== 200) throw Error(body.message)
    return body
  }

  getGarbage = async ()=> {
    try {
      let response = await fetch('/garbage')
      if (response.ok) {
        let jsonResponse = await response.json()
        console.log( `server reply:`, jsonResponse )
        // console.log( `server reply:`, response )
        return //return now, or error below will fire after this conditional
      }
      throw new Error('Request failed!')
    }
    catch (err) { console.log('tried and caught error:',err) }
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.getGarbage}>garbage</button>
        <a href="http://example.com">link</a>
        <p>{this.state.response}</p>
        <Chart />
      </div>
    )
  }
}

export default App
