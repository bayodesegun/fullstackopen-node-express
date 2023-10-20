require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
morgan.token('data',  (req, res) => req.method === 'POST' ? JSON.stringify(req.body): ' ' )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('dist'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
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
    if (error.includes('\n'))
        return response.status(400).json({error})

    const {name, number} = person
    const newPerson = new Person({name, number})
    newPerson.save().then(result => {
      console.log(`Created a new entry - ${result.name} ${result.number}`)
      response.status(201).json(result)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(_person => _person.id === id)
    if (!person) return response.status(404).json({detail: 'Phonebook entry not found!'})

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(result => {
      console.log(`Deleted ${result.name} (${result.number}) from the phonebook.`)
      response.status(204).end()
    })
})

app.get('/info', (request, response) => {
    const info = `
    <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}</p>
    <p>${new Date()}</p>
    `
    response.send(info)
  })


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
