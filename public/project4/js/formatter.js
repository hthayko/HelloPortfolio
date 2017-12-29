var movies = require("../data/movies.json");

var actors = getActors(movies);
var actIndex = {};

var mCount = {};

for(var ind = 0; ind < actors.length; ++ind){
  var a = actors[ind]
  actIndex[a] = ind;
}

for(var m_id in movies) {
  var m = movies[m_id]
  for (var i = 0; i < m.length; ++i){
    for (var j = i+1; j < m.length; ++j){
      var ind1 = actIndex[m[i]];
      var ind2 = actIndex[m[j]];
      if(ind1 > ind2) {
        var tmp = ind1;
        ind1 = ind2;
        ind2 = tmp;
      }
      var pair = ind1 + " " + ind2
      mCount[pair] = mCount[pair] || 0;
      mCount[pair]++;
    }
  }
}

for (var pair in mCount){
  if(mCount[pair] > 3){
    console.log(pair)
  }
}

console.log(";")

for(var i = 0; i < actors.length; ++i)
  console.log(i + " , " + actors[i])

function getActors(movies){
  var ret = [], i;
  for(var m_id in movies){
    var m = movies[m_id];

    for(i = 0; i < m.length; ++i){
      var a = m[i];
      if(ret.indexOf(a) == -1) ret.push(a);
    }
  }
  return ret;
}

