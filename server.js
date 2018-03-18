//packages
require('dotenv').config()
const express = require('express')
, session = require('express-session')
, passport = require('passport')
, TwitterStrategy = require('passport-twitter').Strategy

//setup passport
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "http://localhost:5000/auth/twitter/callback"
},
(token, tokenSecret, profile, done) => {
    //purpose of this verify callback: find user matching credential arguments. When Passport authenticates a request, it parses the credentials contained in the request. It then invokes this verify callback with the credentials. You then check if they're valid and invokes done() to supply Passport with the user that authenticated.

    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
    // console.log('twitter username: ', profile.username)
    done(null, profile.username) //supply Passport with the user that authenticated
    // done(null,false) //failed authentication on your end. (remember twitter will only return with credentials of valid twitter accounts)
  }
) )
passport.serializeUser( (user, done) => {
  done(null, user)
})
passport.deserializeUser( (user, done) => {
  done(null, user)
})

//create app
const app = express()
const port = process.env.PORT || 5000

//middleware
  // configure/use express-session middleware BEFORE PASSPORT!!!!
  app.use(session( {secret:'whatever', resave:true, saveUninitialized:true} ) )
  
  //use passport
  app.use(passport.initialize())
  app.use(passport.session())
  
  //parse requests with urlencoded payloads to make req.body object
  app.use('/', express.urlencoded({extended:false}) )

  //log all requests received
  // app.use( /^\S+/, (req,res,next) => { //this route path matches 1 or more non whitespace chars
  app.use( '/', (req,res,next) => { //matches /, /apples, /apples/bears
    console.log(`${req.method} request received with url: ${req.originalUrl}`)
    next()
  })

  // Redirect the user to Twitter for authentication.  When complete, Twitter will redirect the user back to /auth/twitter/callback
  app.get('/auth/twitter', passport.authenticate('twitter') )
  // Twitter will redirect the user to this URL after approval.  Finish the authentication process by attempting to obtain an access token. If access was granted, the user will be logged in.  Otherwise, authentication has failed.
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/poo', failureRedirect:'/poo2' } )
  )

  //testing
  app.get( '/poo', (req,res,next) => {
    console.log(`current user: ${req.user}`)
    res.sendFile( `${__dirname}/test.html` )
    // next()
  })
  app.get( '/poo2', (req,res,next) => { //this will never get called since verify callback only implements done(null, user)
    res.sendFile( `${__dirname}/test2.html` )
    // next()
  })
  app.post( '/give_food', (req,res,next) => {
    console.log(req.headers['content-type'], req.body)
    res.end()
  })


  //uncomment when production build is ready in client/build folder
  // app.use(‘/’, express.static(`${__dirname}/client/build`))

  app.get('/api/hello', (req,res) => {
    res.send({ express: '...Hello From Express' })
  })

//error handler
app.use((err,req,res,next)=> {
  res.status(err.status || 500)
})

app.listen(port, () => console.log(`Listening on port ${port}`))