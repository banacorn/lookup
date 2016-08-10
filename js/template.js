System.register(["./parser/element"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var element_1;
    function deNoun(params) {
        console.log(params);
        return [element_1.plain("hey")];
    }
    // https://en.wiktionary.org/wiki/Template:de-noun
    function transclude(template) {
        switch (template.name) {
            case "de-noun": return deNoun(template.params);
        }
        return undefined;
    }
    return {
        setters:[
            function (element_1_1) {
                element_1 = element_1_1;
            }],
        execute: function() {
            exports_1("transclude", transclude);
        }
    }
});
