System.register(["../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var template_1, F;
    // {{IPA|pronunciation 1|pronunciation 2|pronunciation 3|lang=en}}
    function rhymes(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        var result = [F.seg("Rhymes: ")];
        // rhymes
        unnamed.forEach(function (rhyme, i) {
            if (i !== 0)
                result = F.add(result, ", ");
            result = F.add(result, "-" + F.extractText(rhyme), false, true);
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
            exports_1("default",rhymes);
        }
    }
});
