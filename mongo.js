const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('You need to specify the password at least')
  process.exit(1)
}

let name
let number
const password = process.argv[2]
if (process.argv.length > 3) {
  [, , , name, number] = process.argv
}

const url = `mongodb+srv://fullstackopen:${password}@bit2cluster.qcfygi7.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (name) {
  const person = new Person({ name, number })
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
