const express = require('express')
const axios = require('axios')
const helmet = require('helmet')
const RateLimit = require('express-rate-limit')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
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

app.get('/set-agenda-data', (req, res, next) => {
  console.log('set-agenda-data called')
  
  axios.get('https://platzi.com/agenda/')
    .then((response) => {
      var $ = cheerio.load(response.data)
      eval($('html > body > script')[9].children[0].data)
      var dataArray = Object.values(data.scheduleItems.agenda_all.agenda_items)

      dataArray.sort( (a, b) => {
        return new Date(a.start_time) - new Date(b.start_time)
      })
      
      try {
        fs.writeFileSync('data.json', JSON.stringify(
          dataArray.map(item => Object.assign({}, item, {
            details: data.scheduleItems.agenda_all.agenda_courses[item.course]
          }))
        ))
        res.send({ message: "ok" })
      } catch (err) {
        console.log(`Write error, ${err.message}`)
        res.send({ message: err.message })
      }
    })
    .catch((err) => {
      console.log(`AXIOS ERROR!! ${err.message}`)
      res.status(200)
      res.send({
        message: err.message
      })
    })
})

app.get('/get-agenda-data', (req, res, next) => {
  console.log('get-agenda-data called')
  res.setHeader('Cache-Control', 'public, max-age=43200')
  res.sendFile(path.join(__dirname, './data.json'))
})

var server = app.listen(process.env.PORT || 5000, () => {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});