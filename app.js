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
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));/*
* To see the code for this answer
* go to https://github.com/kamatheuska/portfolio/blob/master/controllers/urlShortener.js#L6
*/
app.post('/api/shorturl', async (req, res, next) => {
  try {
    const response = await fetch(shorturlEndpoint, {
      method: 'POST',
      body: req.body,
      headers: { 'Content-Type': 'application/json' },
    });
    
    const url = await response.json();
    console.log('URL: ', url);

    res.send(url)
  } catch (error) {
    next(error)
  }
})

/*
* To see the code for this answer
* go to https://github.com/kamatheuska/portfolio/blob/master/controllers/urlShortener.js#L5
*/
app.get('/api/shorturl/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const response = await fetch(`${shorturlEndpoint}/${id}?json=true`)

    const url = await response.json()

    res.redirect(302, url.original)
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