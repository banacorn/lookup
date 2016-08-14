System.register(["../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F;
    // https://en.wiktionary.org/wiki/Template:de-inflected_form_of
    // {{de-inflected form of|ein}}
    function deInFlectedFormOf(word, named, unnamed) {
        return [
            F.seg("inflected form of ", true),
            F.seg("" + F.extractText(unnamed[0]), false, true)
        ];
    }
    return {
        setters:[
            function (F_1) {
                F = F_1;
            }],
        execute: function() {
            exports_1("default",deInFlectedFormOf);
        }
    }
});
