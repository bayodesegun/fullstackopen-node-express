const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
morgan.token('data',  (req, res) => req.method === 'POST' ? JSON.stringify(req.body): ' ' )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    let error = 'Please fix the following errors: '
    if (!person.name) {
        error = `${error}
- Name is missing`
    }
    if (!person.number) {
        error = `${error}
- Number is missing`
    }
    if (persons.find(_person => _person.name === person.name)) {
        error = `${error}
- Name must be unique`
    }
    if (error.includes('\n'))
        return response.status(400).json({error})

    const newPerson = {...person, id: Math.ceil(Math.random() * 99 + 1)}
    persons = persons.concat(newPerson)

    response.status(201).json(newPerson)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(_person => _person.id === id)
    if (!person) return response.status(404).json({detail: 'Phonebook entry not found!'})

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(_person => _person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    const info = `
    <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}</p>
    <p>${new Date()}</p>
    `
    response.send(info)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
