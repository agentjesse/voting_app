//packages
const express = require('express')
require('dotenv').config()

//create app
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use((req,res)=>{ console.log(`request made of type: ${req.method}`) })

//routes
app.get('/api/hello', (req, res) => {
  res.send({ express: '...Hello From Express' })
})

//error handler
app.use((err,req,res,next)=> {
  res.status(err.status || 500)
})

app.listen(port, () => console.log(`Listening on port ${port}`))