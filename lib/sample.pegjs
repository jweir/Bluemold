start = (BLOCK / TEXT)*

TEXT = body:TEXT_INNER+ {return ["text", body.join("")]}

TEXT_INNER 
  =  !"{{" c:. {return c}


/* ====== Blocks ====== */

BLOCK
 = "{{" body:BLOCK_INNER+ "}}" { return ["block", body.join("")]}

BLOCK_INNER
 = body:OBJECT {return body} 
 / body:EMPTY_OBJECT { return body}
 / !"}}" body:. {return body} 


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

