const express = require('express')
const app = express()

app.use('/p5', express.static('node_modules/p5/lib'))
app.use(express.static('web'))
app.listen(5000, () => {
  console.log('Webserver is running on port 5000')
})
