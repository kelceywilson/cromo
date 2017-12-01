const express = require('express')
const bcrypt = require('bcryptjs')

// const db = require('../db/db.js')

const { vote, login, register } = require('../db/db.js')

const router = express.Router()

// GET home page - layout.pug
router.get('/', (req, res) => {
  res.render('postAlert', {csrfToken: req.csrfToken()})
})
// GET registration modal - register.pug
router.get('/postAlert', (req, res) => {
  res.render('postAlert', {csrfToken: req.csrfToken(), member: req.session.member})
})
// POST register new user
router.post('/register', function (req, res) {
  // const salt = bcrypt.genSaltSync(10)   // old way
  // const hash = bcrypt.hashSync(req.body.password, salt)
  const hash = bcrypt.hashSync(req.body.password, 14)
  const firstName = req.body.first_name
  const lastName = req.body.last_name
  const email = req.body.email
  register(firstName, lastName, email, hash)
    .then((data) => {
      console.log('data', data)
      // res.clearCookie('error')
      // res.cookie('username', req.body.email)
      // res.cookie('id', data.id)
      res.redirect('/postAlert')
    })
    .catch((error) => {
      console.log('error.code', error.code)
      if (error.code === '23505') {
        res.cookie('error', 'user with that email already exists')
      }
      res.redirect('/')
    })
})
router.post('/login', function (req, res) {
  login(req.body.email)
    .then((member) => {
      if (!member) {
        res.cookie('error', 'Invalid email/password combo')
      } else {
        console.log('routes', member)
        if (bcrypt.compareSync(req.body.password, member.password)) {
          console.log('user/password match! member:', member.first_name)
          req.session.member = member.first_name
          res.redirect('/postAlert')
        } else {
          res.render('login', { error: 'Invalid email/password combo' })
        }
      }
    })
    .catch((error) => {
      console.log('error', error)
      // if (error.code === '23505') {
      //   res.cookie('error', 'user with that email already exists')
      // }
      // res.redirect('/')
    })
})
// PUT votes into database
router.put('/votes', (req, res) => {
  console.log(req.body.id, req.body.direction, req.body.amount)
  vote(req.body.id, req.body.direction, req.body.amount)
    .then((results) => {
      console.log('here', results)
      res.json(results)
    })
    .catch(console.error)
})

module.exports = router
