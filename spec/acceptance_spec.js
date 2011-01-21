var Bluemold = require(__dirname+"/../lib/bluemold").Bluemold;

describe('a simple template', function(){
  it("should render", function(){
    expect(Bluemold("hello {{each [1,2,3]}}world {{/each}}")).toEqual("hello world world world ")
  });
});
