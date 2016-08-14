System.register(["../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var template_1, F;
    // https://en.wiktionary.org/wiki/Template:homophones
    // {{homophones|bous|bout|lang=fr}}
    function homophones(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        var result = [F.seg("Homophones: ")];
        // homophones
        unnamed.forEach(function (homophone, i) {
            if (i !== 0)
                result = F.add(result, ", ");
            result = F.add(result, "" + F.extractText(homophone));
        });
        return result;
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
            exports_1("default",homophones);
        }
    }
});
