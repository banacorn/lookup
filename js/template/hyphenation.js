System.register(["../fmt", "../template"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F, template_1;
    // https://en.wiktionary.org/wiki/Template:hyphenation
    // {{hyphenation|knowl|edge|caption=Hyphenation US|lang=en}}
    function hyphenation(word, named, unnamed) {
        var result = [];
        // caption
        template_1.find(named, "caption", function (value) {
            result = F.add(result, F.extractText(value) + ": ");
        }, function () {
            result = F.add(result, "Hyphenation: ");
        });
        // hyphenation
        unnamed.forEach(function (segment, i) {
            if (i !== 0)
                result = F.add(result, "\u2027");
            result = F.add(result, "" + F.extractText(segment));
        });
        return result;
    }
    return {
        setters:[
            function (F_1) {
                F = F_1;
            },
            function (template_1_1) {
                template_1 = template_1_1;
            }],
        execute: function() {
            exports_1("default",hyphenation);
        }
    }
});
