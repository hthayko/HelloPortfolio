var csv = require('csv-parser')
var fs = require('fs')

var movies = {}
fs.createReadStream('data/c_10.csv')
  .pipe(csv())
  .on('data', function (data) {
    var a = data.cast.replace(/'/g, '"')
    a = a.replace(": None}", ': null');
    a = JSON.parse(a)
    console.log("------------------------ got data!")
    console.log(a)
    

  })