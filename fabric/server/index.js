const express = require('express')
const app = express()

app.post('/nest', (req, res) => {
  console.log(req.body)

  res.send('Hello World!')

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))