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

  callApi = async () => {
    // console.log(`making fetch`)
    const response = await fetch('/api/hello') //this will pass through the proxy for sure. not sure about browser based url requests...maybe react-router will handle because port 3000 is forced there?
    const body = await response.json()
    // console.log(`body:`,body)
    if (response.status !== 200) throw Error(body.message)
    return body
  }

  getGarbage = async () => {
    try {
      let response = await fetch('/garbage')
      if (response.ok) {
        let jsonResponse = await response.json()
        console.log(`server reply:`, jsonResponse)
        // console.log( `server reply:`, response )
        return //return now, or error below will fire after this conditional
      }
      throw new Error('Request failed!')
    }
    catch (err) { console.log('tried and caught error:', err) }
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.getGarbage}>garbage</button>
        <a href="http://example.com">example.com</a>
        <a href="/auth/twitter">twitter auth link (only works in prod when express hosts client app on same port)</a>
        <p>{this.state.response}</p>
        <Chart />
      </div>
    )
  }
}

export default App
