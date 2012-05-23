// A simple child process for spawning a bluemold engine
var bluemold = require('./bluemold');

process.on("message", function(m){
  var result = bluemold.apply(this,m);
  process.send(result);
});
