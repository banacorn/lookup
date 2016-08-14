System.register(["../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var template_1, F;
    // https://en.wiktionary.org/wiki/Template:de-inflected_form_of
    // {{de-inflected form of|ein}}
    function deInFlectedFormOf(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        return [
            F.seg("inflected form of ", true),
            F.seg("" + F.extractText(unnamed[0]), false, true)
        ];
    }
    return {
        setters:[
            function (template_1_1) {
                template_1 = template_1_1;
            },
            function (F_1) {
                F = F_1;
            }],
        execute: function() {
            exports_1("default",deInFlectedFormOf);
        }
    }
});
