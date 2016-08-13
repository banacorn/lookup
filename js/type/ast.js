System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AST;
    return {
        setters:[],
        execute: function() {
            (function (AST) {
                // smart constructors
                AST.plain = function (s) { return {
                    kind: "plain",
                    text: s
                }; };
                AST.italic = function (xs) { return {
                    kind: "italic",
                    subs: xs
                }; };
                AST.bold = function (xs) { return {
                    kind: "bold",
                    subs: xs
                }; };
                AST.link = function (xs) { return {
                    kind: "link",
                    subs: xs
                }; };
                AST.parameter = function (x, xs) { return {
                    name: x,
                    value: xs
                }; };
                AST.template = function (x, xs) { return {
                    kind: "template",
                    name: x,
                    params: xs
                }; };
            })(AST || (AST = {}));
            exports_1("AST", AST);
        }
    }
});
