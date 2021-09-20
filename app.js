const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const User = require('./models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, MONGODB_URI } = require('./config/keys')
const Todo = require('./models/Todo')

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
  console.log('Connected To MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.log('Error', err)
})

app.use(express.json())

app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password)
      return res.status(422).json({ error: 'Please Enter All The Fields' })

    const user = await User.findOne({ email })

    if (user)
      return res
        .status(422)
        .json({ error: 'User Already Exists With That Email' })

    const hashedPasswords = await bcrypt.hash(password, 12)

    await new User({
      email,
      password: hashedPasswords,
    }).save()

    res.status(200).json({ message: 'Signup Success You Can Now Login' })
  } catch (err) {
    console.log(err)
  }
})

const requireLogin = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization)
    return res.status(401).json({ error: 'You Must Be Logged In' })

  try {
    const { userId } = jwt.verify(authorization, JWT_SECRET)
    req.user = userId
    next()
  } catch (err) {
    return res.status(401).json({ error: 'You Must Be Logged In' })
  }
}

app.get('/test', requireLogin, (req, res) => {
  res.json({ userId: req.user })
})

app.post('/signin', async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password)
      return res.status(422).json({ error: 'Please Enter All The Fields' })

    const user = await User.findOne({ email })

    if (!user)
      return res
        .status(404)
        .json({ error: "User Doesn't Exists With That Email" })

    const doMatch = await bcrypt.compare(password, user.password)

    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET)
      res.status(201).json({ token })
    } else {
      return res.status(401).json({ error: 'Email/Password Is Invalid' })
    }
  } catch (err) {
    console.log(err)
  }
})

app.post('/createTodo', requireLogin, async (req, res) => {
  const data = await new Todo({
    todo: req.body.todo,
    todoBy: req.user,
  }).save()

  res.status(201).json({ message: data })
})

app.get('/getTodos', requireLogin, async (req, res) => {
  const data = await Todo.find({
    todoBy: req.user,
  })
  res.status(200).json({ message: data })
})

app.delete('/removeTodo/:id', requireLogin, async (req, res) => {
  const removeTodo = await Todo.findByIdAndRemove({
    _id: req.params.id,
  })
  res.status(200).json({ message: removeTodo })
})

if (process.env.NODE_ENV === 'production') {
  const path = require('path')

  app.get('/', (req, res) => {
    app.use(express.static(path.resolve(__dirname, 'client', 'build')))
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log('Server Running On', PORT)
})
