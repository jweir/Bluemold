var send = require(__dirname+"/../lib/process.js");

describe("sending a template and date", function(){
  it("renders the template to the callback", function(){
    var result = "why";
    runs(function(){
      send(["${a}", {a:"hello"}], 100, function(m){ result = m})
    })
    waitsFor(function(){ return result == "hello" }, 200)
  })
})

describe("a tmpl being called infinitely in a loop", function(){
  it("should kill the process", function(){
    var data = {partial : "{{tmpl partial}}{{tmpl partial}}"};
    var cp;
    runs(function(){
      cp = send(["{{tmpl partial}}", data], 100)
    })
    waitsFor(function(){ return cp.killed; },300) });
});

