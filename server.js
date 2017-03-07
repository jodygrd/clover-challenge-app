var express = require('express');
var https = require('https');
var path = require('path');

var app = express()
app.use(express.static('your-code-goes-here'));

app.use((request, response, next) => {  
  console.log(request.headers)
  next()
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use((err, request, response, next) => {  
  console.log(err)
  response.status(500).send('Server Error')
})

app.listen(3000, function () {
  console.log('Challenge App listening on port 3000')
});