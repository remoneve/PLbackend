const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

function validateNumber (value) {
  if (/\b\d{2}-\d/.test(value) || /\b\d{3}-\d/.test(value)) return true
  return false
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'Name required!']
  },
  number:{
    type: String,
    minlength: 8,
    required: [true, 'Phone number required']
  }
})

personSchema.path('number').validate(validateNumber, '`{VALUE}` is not a valid phone number!')

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)