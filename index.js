const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()

morgan.token('type', function(req) { 
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

  const randomId = () => { 
    const id = Math.floor(Math.random() * (999-4) + 4)
    return id
  }
  
  app.post('/api/persons', (req, res) => {
    const body = req.body

    const person = {
      name: body.name,
      number: body.number,
      id: randomId(),
    }
  
    if (!body.name) {
        return res.status(400).json ({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return res.status(400).json ({
            error: 'number missing'
        })
    }

    if ((persons.map(person => person.name).includes(body.name))) {
        return res.status(400).json ({
            error: 'name must be unique'
        })
    }

    persons = persons.concat(person)
  
    res.json(person)
  })

  const info = () => {
    const people = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
      return people
  }

  app.get('/info', (req, res) => {
    const body =`<p>Phonebook has info for ${info()} people</p> 
    <p>${new Date()}</p>`

    res.send(body)
  })

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
  
    res.status(204).end()
  })

const PORT = process.env.port || 3001
app.listen(PORT, () =>  {
  console.log(`Server running on port ${PORT}`)
})