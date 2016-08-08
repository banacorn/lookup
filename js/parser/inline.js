System.register(["parsimmon", "lodash", "./combinator"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var P, _, combinator_1;
    var parseFreeLink, parseRenamedLink, parseARLHideParentheses, parseARLHideComma, parseARLHideNamespace, parseARLHideNamespaceAndParantheses, parseAutoRenamedLink, parseUnblendedLink, parseLink, parseComplexTemplate, parseSimpleTemplate, parseTemplate, parseLine;
    function muchoInline(parsers, codaParser) {
        return combinator_1.muchoPrim([], parsers, codaParser, function (x) {
            if (x.kind === "plain") {
                return x.text.length > 0;
            }
            else if (x.kind === "t") {
                return true;
            }
            else {
                return x.subs.length > 0;
            }
        });
    }
    function fromString(s) {
        return {
            kind: "plain",
            text: s
        };
    }
    function parseInlines(codaParser, plainCoda) {
        if (plainCoda === void 0) { plainCoda = []; }
        return P.lazy(function () {
            var defaultPlainCodas = ["[[", "'''", "''", "{{", "\n"];
            return muchoInline([
                parseBold(plainCoda),
                parseItalic(plainCoda),
                parseLink,
                parseTemplate,
                parsePlain(_.concat(defaultPlainCodas, plainCoda))
            ], codaParser);
        });
    }
    function parsePlain(stops) {
        return P.alt(combinator_1.before(stops), P.all).map(function (chunk) {
            return {
                kind: "plain",
                text: chunk
            };
        });
    }
    function parseItalic(plainCoda) {
        if (plainCoda === void 0) { plainCoda = []; }
        return P.seq(P.string("''"), parseInlines(P.string("''"), plainCoda)).map(function (chunk) {
            return {
                kind: "i",
                subs: chunk[1]
            };
        });
    }
    function parseBold(plainCoda) {
        if (plainCoda === void 0) { plainCoda = []; }
        return P.seq(P.string("'''"), parseInlines(P.string("'''"), plainCoda)).map(function (chunk) {
            return {
                kind: "b",
                subs: chunk[1]
            };
        });
    }
    function parseParameter(coda) {
        return combinator_1.beforeWhich(["=", coda]).chain(function (_a) {
            var unknown = _a[0], which = _a[1];
            if (which === "=") {
                return P.string("=").then(parseInlines(P.string(coda), [coda]).map(function (value) {
                    return {
                        name: unknown,
                        value: value
                    };
                }));
            }
            else {
                return P.fail("");
            }
        })
            .or(parseInlines(P.string(coda), [coda]).map(function (value) {
            return {
                name: "",
                value: value
            };
        }));
    }
    return {
        setters:[
            function (P_1) {
                P = P_1;
            },
            function (_1) {
                _ = _1;
            },
            function (combinator_1_1) {
                combinator_1 = combinator_1_1;
            }],
        execute: function() {
            parseFreeLink = P.seq(P.string("[["), combinator_1.before(["]]"]), P.string("]]")).map(function (chunk) {
                return {
                    kind: "a",
                    subs: [fromString(chunk[1])]
                };
            });
            parseRenamedLink = P.seq(P.string("[["), combinator_1.before(["|"]), P.string("|"), parseInlines(P.string("]]"), ["]]"])).map(function (chunk) {
                return {
                    kind: "a",
                    subs: chunk[3]
                };
            });
            parseARLHideParentheses = P.seq(combinator_1.before(["("]), P.string("("), combinator_1.before([")"]), P.string(")"), P.optWhitespace).map(function (chunk) {
                return {
                    kind: "a",
                    subs: [fromString(chunk[0])]
                };
            });
            parseARLHideComma = P.seq(combinator_1.before([","]), P.string(","), combinator_1.before(["|"])).map(function (chunk) {
                return {
                    kind: "a",
                    subs: [fromString(chunk[0])]
                };
            });
            parseARLHideNamespace = P.seq(combinator_1.before([":"]), P.string(":"), combinator_1.before(["|"])).map(function (chunk) {
                return {
                    kind: "a",
                    subs: [fromString(chunk[2])]
                };
            });
            parseARLHideNamespaceAndParantheses = P.seq(combinator_1.before([":"]), P.string(":"), parseARLHideParentheses).map(function (chunk) {
                return {
                    kind: "a",
                    subs: chunk[2].subs
                };
            });
            parseAutoRenamedLink = P.seq(P.string("[["), P.alt(parseARLHideNamespaceAndParantheses, parseARLHideNamespace, parseARLHideParentheses, parseARLHideComma), P.string("|]]")).map(function (chunk) {
                return chunk[1];
            });
            parseUnblendedLink = P.alt(parseAutoRenamedLink, parseRenamedLink, parseFreeLink);
            parseLink = P.seq(parseUnblendedLink, P.letters).map(function (chunk) {
                if (chunk[0].subs) {
                    if (chunk[1].length > 0) {
                        chunk[0].subs.push({
                            kind: "plain",
                            text: chunk[1]
                        });
                    }
                }
                else {
                    chunk[0].subs = [{
                            kind: "plain",
                            text: chunk[0].text + chunk[1]
                        }];
                }
                return chunk[0];
            });
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
            parseLine = P.seq(P.string("#").many(), P.string("*").many(), P.string(":").many(), P.optWhitespace, parseInlines(P.regex(/\n/))).map(function (chunk) {
                return {
                    oli: chunk[0].length,
                    uli: chunk[1].length,
                    indent: chunk[2].length,
                    line: chunk[4]
                };
            });
            exports_1("fromString", fromString);
            exports_1("parseLine", parseLine);
        }
    }
});
