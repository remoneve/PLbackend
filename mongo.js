const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 4 || process.argv.length > 5) {
    console.log('invalid arguments')
    process.exit(1)
  }

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.laki1t5.mongodb.net/PLApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: newName,
  number: newNumber,
})

if (process.argv.length === 5) {
    person.save().then(result => {
        console.log(`Added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
      }) 
}

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
}

