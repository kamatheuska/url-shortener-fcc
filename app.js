import express from 'express'
import fetch from 'node-fetch'
import morgan from 'morgan'
import cors from 'cors'

const app = express()


const PORT = process.env.PORT || 6000;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000'

const shorturlEndpoint = `${API_BASE_URL}/api/shorturl`;

app.use(morgan('dev'));
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

app.get('/api/shorturl', async (req, res, next) => {
  try {
    const response = await fetch(shorturlEndpoint)
    const result = await response.json();

    res.send(result)
  } catch (error) {
    next(error)
  }
})

app.get('/api/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const response = await fetch(`${shorturlEndpoint}/${id}`)

    const result = await response.json();

    res.send(result)
  } catch (error) {
    next(error)
  }
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(400).send({ error: 'invalid url' });
})

app.listen(PORT, () => {
  console.info(`Listening on port ${PORT}`)
})