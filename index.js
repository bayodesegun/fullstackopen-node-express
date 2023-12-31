require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
// eslint-disable-next-line no-unused-vars
morgan.token('data', (req, res) => (req.method === 'POST' ? JSON.stringify(req.body) : ' '))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.static('dist'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const newPerson = new Person({ name, number })
  newPerson.save()
    .then((createdPerson) => {
      console.log(`Created a new entry - ${createdPerson.name} ${createdPerson.number}`)
      response.status(201).json(createdPerson)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((personFound) => {
      if (personFound) {
        console.log(`Found record ${personFound}`)
        return response.json(personFound)
      }
      return response.status(404).json({ error: 'Phonebook entry not found!' })
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = { name, number }
  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      console.log(`Updated ${updatedPerson.name}'s phone number to ${updatedPerson.number}`)
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        console.log(`Deleted ${deletedPerson.name} (${deletedPerson.number}) from the phonebook.`)
      }
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const info = `
      <p>
        Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}
      </p>
      <p>${new Date()}</p>
      `
      response.send(info)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  return next(error)
}
app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
