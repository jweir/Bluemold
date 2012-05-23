// parent for sending template messages to a spawned child
// this ensures that rendering occurs in an isolated processed
// and can be killed

function kill(cp, timeout){
  return setTimeout(function(){
    cp.kill("SIGKILL");
    cp.killed = true;
    console.log('killed process', cp.pid, "after "+timeout+"ms");
  }, timeout);
}

function send(message, timeout, callback){
  var timer;

  var cp = require('child_process').fork(__dirname+'/child_process.js');
  timer = kill(cp, timeout);
  cp.once("message", function(m){
    clearTimeout(timer);
    (callback || function(){})(m)
    cp.kill("SIGKILL");
  })

  cp.send(message);
  return cp;
}

module.exports = send;
