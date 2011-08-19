// https://github.com/jquery/jquery-tmpl/blob/master/tests/core.js
var Bluemold = require(__dirname+"/../lib");
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
  });

  it("should handle properties in an if/else block",function(){
    expect(Bluemold(
      "hello {{if Bool}}ok{{else}}\n${title}{{/if}}",
      {Bool:false, title:"book"})).toEqual(
      "hello \nbook");
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

describe("a tmpl being called with data", function(){
  it("should set the context to that data", function(){
    var data = {partial : "${t}"};
    expect(Bluemold("{{tmpl([{t:'bar'},{t:'foo'}]) partial}}", data)).toEqual("barfoo");
  });
});

describe("partials", function(){
  var ifLayout = '\
    {{if NoPartial}}\
        {{html body}}\
    {{else}}\
        {{tmpl partial}}\
        {{html body}}\
    {{/if}}\
    </div>'

  var eachLayout = '\
    {{each Each}}\
        {{tmpl partial}}${$index}\
        {{html body}}${$value}\
    {{/each}}\
    </div>'

  var partial = '${partialValue}';

  it("renders in an if block", function(){
    var result = Bluemold(ifLayout, {NoPartial: false, partialValue : "world", partial : partial, body : "ok"});
    expect(result).toMatch(/ok/);
    expect(result).toMatch(/world/);
  });

  it("should reunder in an each block", function(){
    var result = Bluemold(eachLayout, {Each: ["a","b"], partialValue : "world", partial : partial, body : "ok"});
    expect(result).toMatch(/oka/);
    expect(result).toMatch(/okb/);
    expect(result).toMatch(/world0/);
    expect(result).toMatch(/world1/);
  });
});

describe("require()", function(){
  it("should raise an error", function(){
    expect(Bluemold("${require('foo')}").name).toEqual("ReferenceError");
  });
});
