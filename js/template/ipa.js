System.register(["../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var template_1, F;
    // import { inspect } from "util";
    // const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);
    // {{IPA|pronunciation 1|pronunciation 2|pronunciation 3|lang=en}}
    function ipa(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        var result = [F.seg("IPA: ")];
        // pronunciations
        unnamed.forEach(function (pronunciation, i) {
            if (i !== 0)
                result = F.add(result, ", ");
            result = F.add(result, "" + F.extractText(pronunciation), false, true);
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
            exports_1("default",ipa);
        }
    }
});
