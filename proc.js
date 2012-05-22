var bluemold = require('./lib');

process.on("message", function(m){
  console.log("bluemold recieved:", m);
  var result = bluemold.apply(this,m);
  process.send(result);
});


/*
var cp = {killed:true}, killer;

function restart(){
  if(cp.killed){
    cp = require('child_process').fork('proc.js');
  }
}

function send(message, callback){
  restart();
  killer = setTimeout(function(){
    cp.kill("SIGKILL");
    cp.killed = true;
    console.log('had to kill the process');
  }, 4000);

  cp.once("message", function(m){
    console.log("alright got",m);
    clearTimeout(killer);
    (callback || function(){})(m)
  })

  cp.send(message);
}

send(["{{tmpl blue}}", {blue:"x {{tmpl blue}} {{tmpl blue}}"}])
*/
