System.register(["parsimmon", "lodash", "./../type", "./combinator"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var P, _, type_1, combinator_1;
    var Allowed, insideItalic, insideBold, insideLink, insideTemplate, parseFreeLink, parseARLHideParentheses, parseARLHideComma, parseARLHideNamespace, parseARLHideNamespaceAndParantheses, parseAutoRenamedLink, parseSimpleTemplate, parseElements;
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
        var result = ["''", "'''", "[[", "{{", "}}", "|"];
        if (!(allowed & Allowed.Link)) {
            result.push("]]");
            result.push("|");
        }
        if (!(allowed & Allowed.Template)) {
            result.push("}}");
            result.push("|");
        }
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
            return muchoInline(parsers, codaParser);
        });
    }
    function parsePlain(allowed) {
        return P.alt(combinator_1.before(stopParsers(allowed)), P.all).map(function (chunk) {
            return {
                kind: "plain",
                text: chunk
            };
        });
    }
    function parseItalic(allowed) {
        return P.seq(P.string("''"), parseInlines(insideItalic(allowed), P.string("''"))).map(function (chunk) {
            return {
                kind: "italic",
                subs: chunk[1]
            };
        });
    }
    function parseBold(allowed) {
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
    function parseParameter(allowed, coda) {
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
    function parseParagraph(text) {
        var prefixRegex = /(.*)\n(#*)(\**)(\:*) ?(.*)/;
        var result = parseElements.parse(text);
        if (result.status) {
            var prefixes_1 = result.value.map(function (element, i) {
                if (element.kind === "plain") {
                    var match = element.text.match(prefixRegex);
                    if (match) {
                        return {
                            oli: match[2].length,
                            uli: match[3].length,
                            indent: match[4].length,
                            index: i,
                            before: match[1],
                            after: match[5]
                        };
                    }
                }
            }).filter(function (x) { return x; });
            var lines_1 = [];
            prefixes_1.forEach(function (prefix, i) {
                if (i < prefixes_1.length - 1) {
                    var next = prefixes_1[i + 1];
                    var segment = result.value.slice(prefix.index + 1, next.index);
                    var mergedLine = segment;
                    if (prefix.after)
                        mergedLine = _.concat([type_1.AST.plain(prefix.after)], mergedLine);
                    if (next.before)
                        mergedLine = _.concat(mergedLine, [type_1.AST.plain(next.before)]);
                    lines_1.push({
                        oli: prefix.oli,
                        uli: prefix.uli,
                        indent: prefix.indent,
                        line: mergedLine
                    });
                }
                else {
                    var segment = result.value.slice(prefix.index + 1);
                    var mergedLine = segment;
                    if (prefix.after)
                        mergedLine = _.concat([type_1.AST.plain(prefix.after)], mergedLine);
                    lines_1.push({
                        oli: prefix.oli,
                        uli: prefix.uli,
                        indent: prefix.indent,
                        line: mergedLine
                    });
                }
            });
            return {
                kind: "ok",
                value: lines_1
            };
        }
        else {
            return {
                kind: "err",
                error: "index: " + result.index.toString()
            };
        }
    }
    return {
        setters:[
            function (P_1) {
                P = P_1;
            },
            function (_1) {
                _ = _1;
            },
            function (type_1_1) {
                type_1 = type_1_1;
            },
            function (combinator_1_1) {
                combinator_1 = combinator_1_1;
            }],
        execute: function() {
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
            parseFreeLink = P.seq(P.string("[["), combinator_1.before(["]]"]), P.string("]]")).map(function (chunk) {
                return {
                    kind: "link",
                    subs: [type_1.AST.plain(chunk[1])]
                };
            });
            parseARLHideParentheses = P.seq(combinator_1.before(["("]), P.string("("), combinator_1.before([")"]), P.string(")"), P.optWhitespace).map(function (chunk) {
                return {
                    kind: "link",
                    subs: [type_1.AST.plain(chunk[0].trim())]
                };
            });
            parseARLHideComma = P.seq(combinator_1.before([","]), P.string(","), combinator_1.before(["|"])).map(function (chunk) {
                return {
                    kind: "link",
                    subs: [type_1.AST.plain(chunk[0].trim())]
                };
            });
            parseARLHideNamespace = P.seq(combinator_1.before([":"]), P.string(":"), combinator_1.before(["|"])).map(function (chunk) {
                return {
                    kind: "link",
                    subs: [type_1.AST.plain(chunk[2])]
                };
            });
            parseARLHideNamespaceAndParantheses = P.seq(combinator_1.before([":"]), P.string(":"), parseARLHideParentheses).map(function (chunk) {
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
            parseElements = parseInlines(15, P.alt(P.eof));
            exports_1("parseElements", parseElements);
            exports_1("parseParagraph", parseParagraph);
        }
    }
});
