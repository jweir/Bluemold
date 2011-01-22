var parser = require("./sample.js").parser;

console.log(parser.parse("just {text} string {{ block with{object {object}} }} string"));
