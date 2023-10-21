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


app.get('/api/persons', (request, response, next) => {
  Person.find({})
		.then(persons => {
			response.json(persons)
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const person = request.body
	let error = {}
	if (!person.name) error.name = 'Name is missing'
	if (!person.number) error.number = 'Number is missing'
	if (Object.keys(error).length > 0) {
		return response.status(400).json({error})
	}

	const {name, number} = person
	const newPerson = new Person({name, number})
	newPerson.save()
		.then(createdPerson => {
			console.log(`Created a new entry - ${createdPerson.name} ${createdPerson.number}`)
			response.status(201).json(createdPerson)
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(_person => _person.id === id)
	if (!person) return response.status(404).json({detail: 'Phonebook entry not found!'})

	response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	const {name, number} = request.body
	const person = {name, number}
	Person.findByIdAndUpdate(id, person, {new: true})
		.then(updatedPerson => {
			console.log(`Updated ${updatedPerson.name}'s phone number to ${updatedPerson.number}`)
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id
	Person.findByIdAndDelete(id)
		.then(deletedPerson => {
			if (deletedPerson)
				console.log(`Deleted ${deletedPerson.name} (${deletedPerson.number}) from the phonebook.`)
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.get('/info', (request, response) => {
	const info = `
	<p>Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}</p>
	<p>${new Date()}</p>
	`
	response.send(info)
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
