var Bluemold = require(__dirname+"/../lib").Bluemold;
var fs = require('fs');

describe("a template with a sytax error", function(){
  var file = fs.readFileSync(__dirname+"/samples/syntax_error.tmpl", "utf8");
  var result = Bluemold(file, {}, "test.tmpl");

  it("should have the name of the template", function(){
    expect(result.template).toEqual("test.tmpl");
  });

  it("should have a line number", function(){
    expect(result.lineNumber).toEqual(5);
  });
})

describe("a template with a javascript error", function(){
  var file = fs.readFileSync(__dirname+"/samples/js_error.tmpl", "utf8");
  var result = Bluemold(file, {}, "test.tmpl");

  it("should have a linenumber", function(){
    expect(result.lineNumber).toEqual(3);
  });

  it("should have the raw source", function(){
    expect(result.source).toEqual(file);
  });

  it("should have the name of the template", function(){
    expect(result.template).toEqual("test.tmpl");
  });
});

describe("a partial with a javascript error", function(){
  var partial = fs.readFileSync(__dirname+"/samples/js_error.tmpl", "utf8");
  var result = Bluemold("{{tmpl partialSrc}}", {partialSrc:partial}, "test.tmpl");

  it("should have the name of the template", function(){
    expect(result.template).toEqual("partialSrc");
  });
});
