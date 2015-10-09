/**
 * pattern example
 * type:email
 * param:max_len(10)
 * expression: required&number required|number (required&number)|(email)
 */

avalon.config({
    paths: {
        parser: "validator/RuleParse"
    },
    shim: {
        parser: {
            exports: "parser"
        }
    }
})

define(["parser"], function(parser) {
    console.log("xxx", parser.parse("xxx"))
    console.log("!xxx", parser.parse("!xxx"))
    console.log("xxx[123]", parser.parse("xxx[123]"))
    console.log("(xxx)", parser.parse("(xxx)"))
    console.log("!(xxx)", parser.parse("!(xxx)"))
    console.log("(!xxx)", parser.parse("(!xxx)"))
    console.log("a&&b", parser.parse("a&&b"))
    console.log("a[1]&&b", parser.parse("a[1]&&b"))
    console.log("xxx&&aaa&&bbb", parser.parse("xxx&&aaa&&bbb"))
    console.log("(aaa&&bbb) && (ccc&&ddd)", JSON.stringify( parser.parse("(aaa&&bbb) && (ccc&&ddd)") ))
    console.log("(aaa&&bbb) || (ccc&&ddd)", parser.parse("(aaa&&bbb) || (ccc&&ddd)"))
    console.log("(aaa&&bbb) || (ccc&&ddd) || (ccc&&ddd)", JSON.stringify( parser.parse("(aaa&&bbb) || (ccc&&ddd) || (eee&&fff)") ))
    console.log("(aaa&&bbb) || (ccc&&ddd) || (ccc&&ddd) || (ggg&&hhh)", parser.parse("(aaa&&bbb) || (ccc&&ddd) || (eee&&fff) || (ggg&&hhh)"))
    console.log("(aaa&&bbb) && (ccc&&ddd) && (eee&&fff) || (ggg&&hhh)", parser.parse("(aaa&&bbb) && (ccc&&ddd) && (eee&&fff) || (ggg&&hhh)"))
    console.log("((aaa&&bbb||(iuo[123]||bbc[iop])) && (ccc&&ddd) && (eee&&fff[1234]) || (ggg&&hhh[xxxx])) || (aaa[1234]&&bbb) && (ccc&&ddd) && (eee&&fff) || (ggg&&hhh)", JSON.stringify( parser.parse("((aaa&&bbb||(iuo[123]||bbc[iop])) && (ccc&&ddd) && (eee&&fff[1234]) || (ggg&&hhh[xxxx])) || (aaa[1234]&&bbb) && (ccc&&ddd) && (eee&&fff) || (ggg&&hhh)") ))
})


