var Bluemold = require(__dirname+"/../lib/bluemold").Bluemold;

describe('a simple template', function(){
  it("should render", function(){
    expect(Bluemold("hello {{each [1,2,3]}}world {{/each}}")).toEqual("hello world world world ")
  });

  it("should render if/else blocks",function(){
    expect(Bluemold(
      "hello {{each [1,2,3]}}{{if $value > 2}}${$value}{{/if}}{{/each}}"))
    .toEqual(
      "hello 3")
  })
});
