const express = require('express')

const db = require('./database.js')
db.sync({
  // force: true,
}).then(() => console.log('db is created!'))

/*Modal*/
const User = require('./user.js')

/*APP*/

const app = express()

app.use(express.json()) // we use it to accept json rquest data

/*User routes*/
app.post('/users', async (req, res) => {
  User.create(req.body).then(() => {
    res.send('user is inserted!')
  })
})

app.get('/users', async (req, res) => {
  let { limit, page } = req.query

  page = Math.abs(Number.parseInt(page))
  limit = Math.abs(Number.parseInt(limit))

  if (page < 1) {
    return res.send({ message: 'Invalid page number!' })
  }

  const result = await User.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
  })

  res.send({
    rows: result.rows,
    totalPage: parseInt((result.count / limit).toString().split('.')[0]),
    totalRegister: result.count,
  })
})

/* Error handling */
function InvalidException() {
  this.status = 400
  this.message = 'Invalid ID!'
}

function UserNotFaundException() {
  this.status = 401
  this.message = 'User not found!'
}

/*Middleware*/
const numberControl = (req, res, next) => {
  const userID = Number.parseInt(req.params.id)

  if (Number.isNaN(userID)) {
    throw new InvalidException()
  }

  next()
}

app.get('/users/:id', numberControl, async (req, res, next) => {
  const userID = Number.parseInt(req.params.id)
  const user = await User.findOne({
    where: { id: userID },
  })

  if (!user) {
    next(new UserNotFaundException())
  }

  res.send(user || [])
})

app.put('/users/:id', numberControl, async (req, res) => {
  const userID = req.params.id

  const user = await User.findOne({
    where: { id: userID },
  })

  if (user) {
    user.username = req.body.username || user.username
    user.password = req.body.password || user.password
    user.email = req.body.email || user.email
    await user.save()
  } else {
    res.send({ message: 'User not found!', updated: false })
  }

  res.send({ message: 'Updated as sucess fully!', updated: true })
})

app.delete('/users/:id', numberControl, async (req, res) => {
  const userID = req.params.id

  const user = await User.destroy({
    where: { id: userID },
  })

  res.send({ message: 'user was remuved!', remuved: true })
})

app.use((err, req, res, next) => {
  return res.status(err.status).send({
    message: err.message,
    timestamp: Date.now(),
    path: req.originalUrl,
  })
})

app.listen(3000, () => {
  console.log('app is running')
})
