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

  response.status(200).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { username } = request.headers
  const { title, deadline } = request.body

  const user = users.find(user => user.username === username && user.todos.find(todo => todo.id === id))
    .map(userOnlyDataFiltered => { 
      userOnlyDataFiltered.todos[0].title = title
    })
  // user.todos.map(todo => {
  //   if(todo.id === id) {
  //     todo.title = title
  //     todo.deadline = new Date(deadline)
  //   }
  // })

  console.log(user)

  response.status(200).json(user.todos)
})

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.headers
  const { id } = request.params

  const user = users.find(user => user.username === username)

  user.todos.map(todo => {
    if(todo.id === id) {
      todo.done = true
    }
  })

  response.status(200).json(user.todos)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params

  users.map(user => user.todos.splice(id, 1))

  response.status(200).json(users)
});

module.exports = app;