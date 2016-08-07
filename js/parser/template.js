System.register(["parsimmon", "lodash", "./inline", "./combinator"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var P, _, inline_1, combinator_1;
    var parseComplexTemplate, parseSimpleTemplate, parseTemplate;
    function parseParameter(coda) {
        return combinator_1.before(["=", coda]).chain(function (unknown) {
            return P.string("=")
                .then(inline_1.parseInlines(P.string(coda), [coda]).map(function (value) {
                return {
                    name: unknown,
                    value: value
                };
            }))
                .or(P.string(coda).then(P.succeed({
                name: "",
                value: inline_1.fromString(unknown)
            })));
        });
    }
    return {
        setters:[
            function (P_1) {
                P = P_1;
            },
            function (_1) {
                _ = _1;
            },
            function (inline_1_1) {
                inline_1 = inline_1_1;
            },
            function (combinator_1_1) {
                combinator_1 = combinator_1_1;
            }],
        execute: function() {
            parseComplexTemplate = P.seq(combinator_1.before(["|"]), P.string("|"), parseParameter("|").many(), parseParameter("}}")).map(function (chunk) {
                return {
                    kind: "t",
                    name: chunk[0],
                    params: _.concat(chunk[2], [chunk[3]])
                };
            });
            parseSimpleTemplate = P.seq(combinator_1.before(["}}"]), P.string("}}")).map(function (chunk) {
                return {
                    kind: "t",
                    name: chunk[0],
                    params: []
                };
            });
            parseTemplate = P.string("{{").then(P.alt(parseComplexTemplate, parseSimpleTemplate));
            exports_1("parseTemplate", parseTemplate);
        }
    }
});
