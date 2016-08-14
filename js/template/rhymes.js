System.register(["../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F;
    // https://en.wiktionary.org/wiki/Template:rhymes
    // {{rhymes|ɪsən|lang=en}}
    function rhymes(word, named, unnamed) {
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
            function (F_1) {
                F = F_1;
            }],
        execute: function() {
            exports_1("default",rhymes);
        }
    }
});
