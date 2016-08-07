System.register(["parsimmon", "./combinator", "./inline"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var P, combinator_1, inline_1;
    var parseFreeLink, parseRenamedLink, parseARLHideParentheses, parseARLHideComma, parseARLHideNamespace, parseARLHideNamespaceAndParantheses, parseAutoRenamedLink, parseUnblendedLink, parseLink;
    return {
        setters:[
            function (P_1) {
                P = P_1;
            },
            function (combinator_1_1) {
                combinator_1 = combinator_1_1;
            },
            function (inline_1_1) {
                inline_1 = inline_1_1;
            }],
        execute: function() {
            parseFreeLink = P.seq(P.string("[["), combinator_1.before(["]]"]), P.string("]]")).map(function (chunk) {
                return {
                    kind: "a",
                    subs: [inline_1.fromString(chunk[1])]
                };
            });
            parseRenamedLink = P.seq(P.string("[["), combinator_1.before(["|"]), P.string("|"), inline_1.parseInlines(P.string("]]"), ["]]"])).map(function (chunk) {
                return {
                    kind: "a",
                    subs: chunk[3]
                };
            });
            parseARLHideParentheses = P.seq(combinator_1.before(["("]), P.string("("), combinator_1.before([")"]), P.string(")"), P.optWhitespace).map(function (chunk) {
                return {
                    kind: "a",
                    subs: [inline_1.fromString(chunk[0])]
                };
            });
            parseARLHideComma = P.seq(combinator_1.before([","]), P.string(","), combinator_1.before(["|"])).map(function (chunk) {
                return {
                    kind: "a",
                    subs: [inline_1.fromString(chunk[0])]
                };
            });
            parseARLHideNamespace = P.seq(combinator_1.before([":"]), P.string(":"), combinator_1.before(["|"])).map(function (chunk) {
                return {
                    kind: "a",
                    subs: [inline_1.fromString(chunk[2])]
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
            exports_1("parseLink", parseLink);
        }
    }
});
