System.register(["lodash", "./type/ast"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _;
    function mapSection(f) {
        return function (section) {
            return {
                entryWord: section.entryWord,
                header: section.header,
                body: section.body.map(f),
                subs: section.subs.map(mapSection(f))
            };
        };
    }
    function flattenSection(section) {
        var bodies = [];
        bodies = _.concat(bodies, [{
                header: section.header,
                body: section.body
            }]);
        section.subs.forEach(function (sub) {
            bodies = _.concat(bodies, flattenSection(sub));
        });
        return bodies;
    }
    var exportedNames_1 = {
        'RawText': true,
        'Section': true,
        'ParsedParagraph': true,
        'mapSection': true,
        'flattenSection': true,
        'ParseResult': true,
        'ParseOk': true,
        'ParseErr': true
    };
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default"&& !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (ast_1_1) {
                exportStar_1(ast_1_1);
            }],
        execute: function() {
            exports_1("mapSection", mapSection);
            exports_1("flattenSection", flattenSection);
        }
    }
});
