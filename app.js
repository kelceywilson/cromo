const express = require('express')
const bodyParser = require('body-parser')
const sessions = require('client-sessions')
const csrf = require('csurf')

const routes = require('./routes/routes.js')
const logger = require('morgan')

const app = express()
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static('public'))
app.set('view engine', 'pug')

app.use(sessions({
  cookieName: 'session',
  secret: 'some_random_string',
  duration: 30 * 60 * 1000
  // activeDuration: 30 * 60 * 1000  // optionals
  // httpOnly: true, // don't let JS code access cookies
  // secure: true, // only set cookies over https
  // ephemeral: true // destroy cookies when browser closes
}))
app.use(csrf()) // this needs to be above app.use(routes) - why?
// app.use((req, res, next) => {
//   if(!(req.session && req.session.user)){
//     return next()
//   }
//   User.findOne({ email: req.session.user.email}, function(err, user){
//     if(user){
//       req.user = user
//       delete req.user.password
//       req.session.user = user
//       res.locals.user = user
//     }
//     next()
//   })
// })

app.use(routes)
app.use(logger('dev'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  // If you pass an error to next() and you do not handle it in an error handler, it will be handled by the built-in error handler; the error will be written to the client with the stack trace.
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  console.log(err)
  res.status(err.status || 500)
  res.json({
    error: {
      message: 'here ' + err.message
    }
  })
})

// app.listen(3000, () => {
//   console.log('listening on 3000')
// })

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
