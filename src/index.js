const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(403).json({ error: 'Mensagem do erro' })
  }

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  const user = { 
    id: uuidv4(), 
    name, 
    username, 
    todos: []
  }

  const userAlreadyExists = users.find(user => user.username === username)
  if(userAlreadyExists) return response.status(400).json({ error: 'User already exists'})

  users.push(user)

  response.status(200).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers

  const user = users.find(user => user.username === username)

  response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers
  const { title, deadline } = request.body

  const user = users.find(user => user.username === username)

  const todo = { 
    id: uuidv4(), 
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
   }

  user.todos.push(todo)

  response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { username } = request.headers
  const { title, deadline } = request.body

  const user = users.find(user => user.username === username)

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo) return response.status(404).json({ error: "Todo not exists" })

  todo.title = title
  todo.deadline = deadline

  response.status(200).json(todo)
})

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers
  const { id } = request.params

  const user = users.find(user => user.username === username)

  const todo = user.todos.find(todo => todo.id === id)

  if (!todo) return response.status(404).json({ error: 'Todo not exists' })

  todo.done = true

  response.status(200).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params

  const todoAlreadyExists = users.find(user => user.todos.find(todo => todo.id === id))

  if(!todoAlreadyExists) return response.status(404).json({ error: 'Todo not exists' })

  users.map(user => user.todos.splice(id, 1))

  response.status(204).send()
});

module.exports = app;