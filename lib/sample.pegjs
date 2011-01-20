start = (COMMAND / BLOCK / TEXT)*

TEXT = body:TEXT_INNER+ {return ["text", body.join("")]}

TEXT_INNER
  =  !"{{" c:. {return c}


/* ====== Commands ====== */

COMMAND
 = "{{" _ command:COMMANDS _ body:COMMAND_INNER+ _ "}}" { return [command, body.join("")]}

COMMAND_INNER
 = body:OBJECT {return body}
 / body:EMPTY_OBJECT { return body}
 / !"}}" body:. {return body}

COMMANDS
= "tmpl" / "html" / "!" / "="

/* ====== Blocks ====== */
BLOCK
= head:BLOCK_HEAD tail:BLOCK_TAIL { return (head.command == tail) ? [head.command, head.body.join("")] : "error"} /
  head:BLOCK_HEAD inner:BLOCK_INNER+ tail:BLOCK_TAIL { return (head.command == tail) ? [head.command, head.body.join(""), inner] : "error"}

BLOCK_HEAD
= "{{" _ command:BLOCK_COMMANDS _ body:COMMAND_INNER+ _ "}}" { return {command:command, body:body}}

BLOCK_TAIL
= "{{/" tail:BLOCK_COMMANDS "}}" { return tail }

BLOCK_INNER
 = body:BLOCK {return body}
 / body:COMMAND {return body}
 / !"{{" body:TEXT {return body}

BLOCK_COMMANDS
= "each" / "if"

/* ====== Objects ====== */

EMPTY_OBJECT
 = "{" body:_? "}" {return "{" + body.join("") + "}"}

OBJECT
  = "{" body:OBJECT_INNER+ "}" {return "{"+ body.join("") +"}"}

OBJECT_INNER
  = EMPTY_OBJECT / OBJECT+ / !"}" body:. {return body}

/* ===== Whitespace ===== */

_ "whitespace"
  = whitespace*

// Whitespace is undefined in the original JSON grammar, so I assume a simple
// conventional definition consistent with ECMA-262, 5th ed.
whitespace
  = [ \t\n\r]
