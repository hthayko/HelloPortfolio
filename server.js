var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.use(express.static('public'))

app.get('/test/', function (req, res) {  
    res.send(`Hello World!`);
});

app.get('/', function (req, res) {  
    res.sendFile(`index.html`, {root: __dirname});
});


app.listen(port, function () {
  console.log('app listening on port:', port);
});
