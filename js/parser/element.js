System.register(["parsimmon", "lodash", "./combinator"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var P, _, combinator_1;
    var plain, italic, bold, link, parameter, template, Allowed, insideItalic, insideBold, insideLink, insideTemplate, parseFreeLink, parseARLHideParentheses, parseARLHideComma, parseARLHideNamespace, parseARLHideNamespaceAndParantheses, parseAutoRenamedLink, parseSimpleTemplate, parseElements;
    // const insideTemplate = (x: AllowedParsers) => x ^ Allowed.Template
    // function debug<T>(x: T): T {
    //     console.log(inspect(x, false, null).cyan)
    //     return x;
    // }
    function allowedParsers(allowed) {
        var parsers = [];
        if (allowed & Allowed.Template)
            parsers.push(parseTemplate(allowed));
        if (allowed & Allowed.Link)
            parsers.push(parseLink(allowed));
        if (allowed & Allowed.Bold)
            parsers.push(parseBold(allowed));
        if (allowed & Allowed.Italic)
            parsers.push(parseItalic(allowed));
        parsers.push(parsePlain(allowed));
        return parsers;
    }
    function stopParsers(allowed) {
        // initials
        var result = ["''", "'''", "[[", "{{", "}}", "|"];
        // codas
        if (!(allowed & Allowed.Link)) {
            result.push("]]");
            result.push("|");
        }
        if (!(allowed & Allowed.Template)) {
            result.push("}}");
            result.push("|");
        }
        // if(allowed ^ 15) {
        // result.push("\n* ");
        // }
        return result;
    }
    function muchoInline(parsers, codaParser) {
        return combinator_1.muchoPrim([], parsers, codaParser, function (x) {
            if (x.kind === "plain") {
                var apoInitial = /^'/.test(x.text);
                return x.text.length > 0 && !apoInitial;
            }
            else if (x.kind === "template") {
                return true;
            }
            else if (x.kind === "prefix") {
                return true;
            }
            else {
                return x.subs.length > 0;
            }
        });
    }
    function parseInlines(allowed, codaParser) {
        return P.lazy(function () {
            var parsers = allowedParsers(allowed);
            // console.log(`*** ${showAllowed(allowed)}`.cyan)
            return muchoInline(parsers, codaParser);
        });
    }
    function parsePlain(allowed) {
        // console.log(`plain ${showAllowed(allowed)}`.gray);
        // console.log(`codas ${codaParsers(allowed)}`.gray)
        return P.alt(combinator_1.before(stopParsers(allowed)), P.all).map(function (chunk) {
            return {
                kind: "plain",
                text: chunk
            };
        });
    }
    function parseItalic(allowed) {
        // console.log(`italic ${showAllowed(allowed)}`.yellow);
        return P.seq(P.string("''"), parseInlines(insideItalic(allowed), P.string("''"))).map(function (chunk) {
            return {
                kind: "italic",
                subs: chunk[1]
            };
        });
    }
    function parseBold(allowed) {
        // console.log(`bold ${showAllowed(allowed)}`.yellow);
        return P.seq(P.string("'''"), parseInlines(insideBold(allowed), P.string("'''"))).map(function (chunk) {
            return {
                kind: "bold",
                subs: chunk[1]
            };
        });
    }
    function parseRenamedLink(allowed) {
        return P.seq(P.string("[["), combinator_1.before(stopParsers(insideLink(allowed))), P.string("|"), parseInlines(insideLink(allowed), P.string("]]"))).map(function (chunk) {
            return {
                kind: "link",
                subs: chunk[3]
            };
        });
    }
    function parseUnblendedLink(allowed) {
        return P.alt(parseAutoRenamedLink, parseRenamedLink(allowed), parseFreeLink);
    }
    function parseLink(allowed) {
        return P.seq(parseUnblendedLink(allowed), P.letters).map(function (chunk) {
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
    }
    //
    //  Template
    //
    function parseParameter(allowed, coda) {
        // get the string before "=" or the coda, which in case may be a name or an unnamed value
        return combinator_1.beforeWhich(["=", coda]).chain(function (_a) {
            var unknown = _a[0], which = _a[1];
            if (which === "=") {
                return P.string("=").then(parseInlines(insideTemplate(allowed), P.string(coda)).map(function (value) {
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
            .or(parseInlines(insideTemplate(allowed), P.string(coda)).map(function (value) {
            return {
                name: "",
                value: value
            };
        }));
    }
    function parseComplexTemplate(allowed) {
        return P.seq(combinator_1.before(["|"]), P.string("|"), parseParameter(allowed, "|").many(), parseParameter(allowed, "}}")).map(function (chunk) {
            return {
                kind: "template",
                name: chunk[0],
                params: _.concat(chunk[2], [chunk[3]])
            };
        });
    }
    function parseTemplate(allowed) {
        return P.string("{{").then(P.alt(parseComplexTemplate(allowed), parseSimpleTemplate));
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
            // import { inspect } from "util";
            // import "colors";
            // Type smart constructors
            plain = function (s) { return {
                kind: "plain",
                text: s
            }; };
            italic = function (xs) { return {
                kind: "italic",
                subs: xs
            }; };
            bold = function (xs) { return {
                kind: "bold",
                subs: xs
            }; };
            link = function (xs) { return {
                kind: "link",
                subs: xs
            }; };
            parameter = function (x, xs) { return {
                name: x,
                value: xs
            }; };
            template = function (x, xs) { return {
                kind: "template",
                name: x,
                params: xs
            }; };
            (function (Allowed) {
                Allowed[Allowed["Italic"] = 1] = "Italic";
                Allowed[Allowed["Bold"] = 2] = "Bold";
                Allowed[Allowed["Link"] = 4] = "Link";
                Allowed[Allowed["Template"] = 8] = "Template";
            })(Allowed || (Allowed = {}));
            insideItalic = function (x) { return x ^ Allowed.Italic; };
            insideBold = function (x) { return x ^ Allowed.Bold; };
            insideLink = function (x) { return x ^ Allowed.Link ^ Allowed.Template; };
            insideTemplate = function (x) { return x; };
            //
            //  Links
            //
            parseFreeLink = P.seq(P.string("[["), combinator_1.before(["]]"]), P.string("]]")).map(function (chunk) {
                return {
                    kind: "link",
                    subs: [plain(chunk[1])]
                };
            });
            // Automatically hide stuff in parentheses
            parseARLHideParentheses = P.seq(combinator_1.before(["("]), P.string("("), combinator_1.before([")"]), P.string(")"), P.optWhitespace).map(function (chunk) {
                return {
                    kind: "link",
                    subs: [plain(chunk[0].trim())]
                };
            });
            // Automatically hide the comma and following text
            parseARLHideComma = P.seq(combinator_1.before([","]), P.string(","), combinator_1.before(["|"])).map(function (chunk) {
                return {
                    kind: "link",
                    subs: [plain(chunk[0].trim())]
                };
            });
            // Automatically hide namespace
            parseARLHideNamespace = P.seq(combinator_1.before([":"]), // namespace
            P.string(":"), combinator_1.before(["|"]) // renamed
            ).map(function (chunk) {
                return {
                    kind: "link",
                    subs: [plain(chunk[2])]
                };
            });
            // Automatically hide namespace AND stuffs in parantheses
            parseARLHideNamespaceAndParantheses = P.seq(combinator_1.before([":"]), // namespace
            P.string(":"), parseARLHideParentheses).map(function (chunk) {
                return {
                    kind: "link",
                    subs: chunk[2].subs
                };
            });
            parseAutoRenamedLink = P.seq(P.string("[["), P.alt(parseARLHideNamespaceAndParantheses, parseARLHideNamespace, parseARLHideParentheses, parseARLHideComma), P.string("|]]")).map(function (chunk) {
                return chunk[1];
            });
            parseSimpleTemplate = P.seq(combinator_1.before(["}}"]), P.string("}}")).map(function (chunk) {
                return {
                    kind: "template",
                    name: chunk[0],
                    params: []
                };
            });
            // const parseOLI: Parser<number> = P.string("#").many().map(chunk => chunk[0].length);
            // const parseULI: Parser<number> = P.string("*").many().map(chunk => chunk[0].length);
            // const parseIndent: Parser<number> = P.string(":").many().map(chunk => chunk[0].length);
            // const parsePrefix: Parser<Prefix> = P
            //     .regex(/\n?/)
            //     .then(parseOLI
            //     .chain(oli => parseULI
            //     .chain(uli => parseIndent
            //     .chain(indent => {
            //         if (oli + uli + indent > 0)
            //             return P.string(" ")
            //                 .then(P.succeed(<Prefix>{
            //                     kind:   "prefix",
            //                     oli:    oli,
            //                     uli:    uli,
            //                     indent: indent
            //                 }));
            //         else
            //             return P.succeed(<Prefix>{
            //                 kind:   "prefix",
            //                 oli:    0,
            //                 uli:    0,
            //                 indent: 0
            //             });
            //     }))));
            parseElements = parseInlines(15, P.alt(P.eof));
            exports_1("parseElements", parseElements);
            exports_1("plain", plain);
            exports_1("italic", italic);
            exports_1("bold", bold);
            exports_1("link", link);
            exports_1("parameter", parameter);
            exports_1("template", template);
        }
    }
});
