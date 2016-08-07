System.register(["parsimmon", "lodash", "./combinator", "./template", "./link"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var P, _, combinator_1, template_1, link_1;
    var parseItalic, parseBold;
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
        return P.lazy(function () {
            return muchoInline([
                parseBold,
                parseItalic,
                link_1.parseLink,
                template_1.parseTemplate,
                parsePlain(_.concat(["[[", "'''", "''", "{{"], plainCoda))
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
            },
            function (template_1_1) {
                template_1 = template_1_1;
            },
            function (link_1_1) {
                link_1 = link_1_1;
            }],
        execute: function() {
            parseItalic = P.seq(P.string("''"), parseInlines(P.string("''"))).map(function (chunk) {
                return {
                    kind: "i",
                    subs: chunk[1]
                };
            });
            parseBold = P.seq(P.string("'''"), parseInlines(P.string("'''"))).map(function (chunk) {
                return {
                    kind: "b",
                    subs: chunk[1]
                };
            });
            exports_1("fromString", fromString);
            exports_1("parseInlines", parseInlines);
        }
    }
});
