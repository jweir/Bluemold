# Bluemold Template Engine

Bluemold is a Javascript template engine. It conforms to a subset of the jQuery Template language.

It is designed to run serverside (Node.js) and output HTML or any text based format.

## A really simple example

    var Bluemold = require('./lib/').Bluemold;
    Bluemold('{{each [{name:"dog"},{name:"cat"}]}} I love myself a ${name}.\n{{/each}}');

    I lovemyself a dog. I lovemyself a cat.

## Current State

Newborn.  Brand spanking new. Untested. Not used in production... yet.

No support for the `wrap` function.

## Requirements

[Underscore](http://documentcloud.github.com/underscore/) is the only requirement for rendering the templates.

For development [PEG.JS](http://pegjs.majda.cz/) is used to create the parser. The specs are written using [Jasmine](http://pivotal.github.com/jasmine/).

## Development & Helping out

I would love contributors

## Bugs

Reports bugs [here](https://github.com/jweir/Bluemold/issues). You get 1 point.

Fork the project and create a failing spec – 100 points.

Fork the project, create a failing spec and then fix the feature – 100 points and a mystery powerup!

## Other jQuery Template projects

[Node JQTP](https://github.com/kof/node-jqtpl) is another jQuery Template engine for Node.
