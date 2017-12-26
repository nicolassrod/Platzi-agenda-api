const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const Window = require('window')
const window = new Window()

const app = express()

app.get('/', (req, res, next) => {
  axios.get('https://platzi.com/agenda/')
    .then((response) => {
      var $ = cheerio.load(response.data)
      eval($('script')[17].children[0].data)
      res.send(data.scheduleItems.agenda_all)
    })
})

app.listen(3000, () => {
  console.log('eeeee')
})