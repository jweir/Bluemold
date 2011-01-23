// https://github.com/jquery/jquery-tmpl/blob/master/tests/core.js
var Bluemold = require(__dirname+"/../lib").Bluemold;
var fs = require('fs');

describe('a simple template', function(){
  it("should render", function(){
    expect(Bluemold("hello {{each [1,2,3]}}world {{/each}}")).toEqual("hello world world world ")
  });

  it("should render if blocks",function(){
    expect(Bluemold(
      "hello {{each [1,2,3]}}{{if $value > 2}}${$value}{{/if}}{{/each}}")).toEqual(
      "hello 3");
  })

  it("should render if/else blocks",function(){
    expect(Bluemold(
      "hello {{each [1,2,3]}}{{if $value > 2}}${$value}{{else}}no {{/if}}{{/each}}")).toEqual(
      "hello no no 3");
  })
});

describe("context and data", function(){
  var data = {
    name : "The Lovers",
    people:[{name:"Jim", age:26, children : [{name:"Boy"}]},{name:"Sally", age:71, children : []}]
  };

  it("returns the property from the nearest context", function(){
    expect(Bluemold(
      "${name} {{each people}}${name} {{each children}}${name} {{/each}}{{/each}}", data)).toEqual(
      "The Lovers Jim Boy Sally "
    );
  });
});

describe("a complex template", function(){
  var file = fs.readFileSync(__dirname+"/samples/test.tmpl", "utf8");
  var data = {
    animals  : ["dog", "cat", "goat"],
    partials : {
      animals : "{{each animals}} ${$value}{{/each}}"
    }
  }
  var result = Bluemold(file, data);

  it("should be properly rendered", function(){
    expect(result).toMatch(/Hello World/);
    expect(result).toMatch(/Count\s/);
    expect(result).toMatch(/dog cat goat/);
  });
})

describe("a tmpl being called infinitely", function(){
  it("should fail and raise an error", function(){
    var data = {partial : "{{tmpl partial}}"};
    expect(Bluemold("{{tmpl partial}}", data).name).toEqual("RangeError");
  });
});
