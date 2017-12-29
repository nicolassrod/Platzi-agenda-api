const express = require('express')
const axios = require('axios')
const helmet = require('helmet')
const RateLimit = require('express-rate-limit')
const cheerio = require('cheerio')
const Window = require('window')
const window = new Window()

const app = express()

const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes 
  max: 100, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
})

app.use(limiter)
app.use(helmet({
  frameguard: {action: 'deny'}
}))

app.get('/', (req, res, next) => {
  axios.get('https://platzi.com/agenda/')
    .then((response) => {
      var $ = cheerio.load(response.data)
      eval($('script')[17].children[0].data)
      res.send(data.scheduleItems.agenda_all)
    })
})

app.listen(3000, () => {
  console.log('Server Runing')
})