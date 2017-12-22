var foo = {
  bar : [1, 10, "hey", "I"]
}

var fooHard = {
  school : {
    teacher : ["Jack", "Tom", 23], 
    student : ["Brad", 34, {
      name : "John",
      age : 23,
      word : "love"
    }],
    director : ["Bob", "Marley"]
  }
}



function easyJSONRead(obj){
  // should log string "I"
  // TODO
  console.log()
}

function hardJSONRead(obj){
  // should log string "love"
  // TODO
 console.log()
}

function makeJSON(){
  // should return json, such that
  // obj.b[0].c[1] + obj.d[2].e[3] == "javascript"
  // TODO
  obj = {}
  return obj
}


easyJSONRead(foo)

hardJSONRead(fooHard)

var a = makeJSON()
// console.log(a.b[0].c[1] + a.d[2].e[3])