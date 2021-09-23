const express = require('express')

/*DB*/
const db = require('./database.js')
db.sync({
  force: true,
}).then(() => console.log('db is created!'))

/*Modal*/
const User = require('./user.js')

/*APP*/

const app = express()

app.use(express.json()) // we use it to accept json rquest data

/*User routes*/
app.post('/users', (req, res) => {
  User.create(req.body).then(() => {
    res.send('user is inserted!')
  })
})

app.get('/users', async (req, res) => {
  res.send(await User.findAll())
})

app.get('/users/:id', async (req, res) => {
  const userID = req.params.id
  const user = await User.findOne({
    where: { id: userID },
  })

  res.send(user || [])
})

app.put('/users/:id', async (req, res) => {
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

app.delete('/users/:id', async (req, res) => {
  const userID = req.params.id

  const user = await User.destroy({
    where: { id: userID },
  })

  res.send({ message: 'user was remuved!', remuved: true })
})

app.listen(3000, () => {
  console.log('app is running')
})
