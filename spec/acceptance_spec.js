var Bluemold = require(__dirname+"/../lib/bluemold").Bluemold;

describe('a simple template', function(){
  it("should render", function(){
    expect(Bluemold("hello {{each [1,2,3]}}world {{/each}}")).toEqual("hello world world world ")
  });

  it("should render if blocks",function(){
    expect(Bluemold(
      "hello {{each [1,2,3]}}{{if $value > 2}}${$value}{{/if}}{{/each}}"))
    .toEqual(
      "hello 3")
  })

  it("should render if/else blocks",function(){
    expect(Bluemold(
      "hello {{each [1,2,3]}}{{if $value > 2}}${$value}{{else}}no {{/if}}{{/each}}"))
    .toEqual(
      "hello no no 3")
  })
});

describe("context and data", function(){
  var data = {
    name : "The Lovers",
    people:[{name:"Jim", age:26},{name:"Sally", age:71}]
  };

  it("renders the template with the data", function(){
    expect(
      Bluemold("${name} {{each people}}${name} {{/each}}", data)
    ).toEqual(
      "The Lovers Jim Sally "
    );
  });
});
