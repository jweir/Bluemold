start = (VALUE / COMMAND / BLOCK / TEXT)*

TEXT
  = body:TEXT_INNER+ { return ["text", body.join("")]}

TEXT_INNER
  = !BLOCK_START !VALUE_START c:. {return c}

/* ====== Value ====== */
VALUE
  = VALUE_START inner:VALUE_INNER+ VALUE_END
                      { return ["value", inner.join("")]}

VALUE_START = "${"
VALUE_END   = "}"

VALUE_INNER
  = body:OBJECT       { return body}
  / body:EMPTY_OBJECT { return body}
  / !VALUE_END body:. { return body}

/* ====== Commands ====== */

COMMAND
  = BLOCK_START _ command:COMMANDS _ body:COMMAND_INNER+ _ BLOCK_END
                      { return [command, body.join("")]}

COMMAND_INNER
  = body:OBJECT       { return body}
  / body:EMPTY_OBJECT { return body}
  / !BLOCK_END body:. { return body}

COMMANDS
=   "tmpl"
  / "html"
  / "!"    { return "comment" }
  / "="

/* ====== Blocks ====== */

BLOCK
  = open:BLOCK_OPEN inner:(BLOCK_INNER+)? close:BLOCK_CLOSE
    {
      if(open.command == close){
        return [open.command, open.body.join(""), inner];
      } else {
        var errorPosition = computeErrorPosition();
        throw new this.SyntaxError(
          "No closing tag found for "+head.command,
          errorPosition.line,
          errorPosition.column
        );
      }
    }

BLOCK_START = "{{"
BLOCK_END   = "}}"

BLOCK_OPEN
  = BLOCK_START _ command:BLOCK_COMMANDS _ body:COMMAND_INNER+ _ BLOCK_END
    { return {command:command, body:body}}

BLOCK_CLOSE
  = BLOCK_START "/" tail:BLOCK_COMMANDS BLOCK_END
                      { return tail }

BLOCK_INNER
  = body:BLOCK             { return body}
  / body:COMMAND           { return body}
  / !BLOCK_START body:TEXT { return body}

BLOCK_COMMANDS
  = "each" / "if"

/* ====== Objects ====== */

EMPTY_OBJECT
  = "{" body:_? "}"            { return "{" + body.join("") + "}"}

OBJECT
  = "{" body:OBJECT_INNER+ "}" { return "{"+ body.join("") +"}"}

OBJECT_INNER
  = EMPTY_OBJECT / OBJECT+ / !"}" body:. {return body}

/* ===== Whitespace ===== */

_ "whitespace"
  = whitespace*

// Whitespace is undefined in the original JSON grammar, so I assume a simple
// conventional definition consistent with ECMA-262, 5th ed.
whitespace
  = [ \t\n\r]
