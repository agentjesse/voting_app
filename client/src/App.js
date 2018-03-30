import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Chart from './Chart'
import './App.css'

//initialize context and only grab Provider/Consumer component pair from the returned object. 
//Provider / Consumer CANNOT BE RENAMED!!!!!
const { Provider, Consumer } = React.createContext()
//enhance by adding state to provider component
class MyProvider extends Component {
  state = {
    cats:43
  }
  render() {
    return (
      <Provider
        value={ {  //here value is an object, but can be anything. available in the consumer child function
          state: this.state,
          actions: {
            incrementCats: ()=> this.setState( {cats: this.state.cats + 1} )
          }
        } }
      >
        {this.props.children}
      </Provider>
    )
  }
}

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
        <hr/>

        <p>testing context api</p>
        <MyProvider>
          <Consumer>
            { ( {state, actions} )=> (  //value object available to consumer from provider is destructured
              <Fragment>
                <p>{`cats from dynamic store: ${state.cats}`}</p>
                <button onClick={actions.incrementCats}>more cats!</button>
              </Fragment>
            ) }
          </Consumer>
        </MyProvider>

        <hr/>
        <Router>
          <Fragment>

            {/* regular link here triggers refresh and load this main component again. messy, but gets the job done quickly */}
            <a href='/'>Home</a>
            
            {/* proper links to routes that create modified anchor tags (prevent default refresh) */}
            <Link to='/cat-farts'>Cat Farts</Link>
            <Link to='/squirrel-poop'>Squirrel poop</Link>
            <Link to='/dog-breath'>Dog breath</Link>

            <hr/>

            {/*
              different types of rendering. <Switch> renders the first mathched <Route>/<Redirect> exclusively. In contrast, every <Route> that matches the location renders inclusively.
            */}
            <Switch>
              <Route path='/cat-farts' render={ ()=> <div>cat fart component</div> }/>
              <Route path='/squirrel-poop' component={ Squirrelpoop }/>
              <Route path='/dog-breath' render={ props=> <DogBreath {...props} age={42}/> }/>
            </Switch>

          </Fragment>
        </Router>

      </div>

    )
  }
}

const Squirrelpoop = ( { match: {url} } )=>
  <div>Squirrel poop component with url: {url}</div>

const DogBreath = ( { match: {url}, age } )=>
  <div>
    DogBreath component with url: {url}
    <br/>
    age: {age}
  </div>

export default App
