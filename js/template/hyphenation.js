System.register(["lodash", "../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, template_1, F;
    // https://en.wiktionary.org/wiki/Template:hyphenation
    // {{hyphenation|knowl|edge|caption=Hyphenation US|lang=en}}
    function hyphenation(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        var result = [];
        var caption = _.find(named, ["name", "caption"]);
        // caption
        if (caption && F.extractText(caption.value))
            result = F.add(result, F.extractText(caption.value) + ": ", false, true);
        else
            result = F.add(result, "Hyphenation: ", false, true);
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
            function (_1) {
                _ = _1;
            },
            function (template_1_1) {
                template_1 = template_1_1;
            },
            function (F_1) {
                F = F_1;
            }],
        execute: function() {
            exports_1("default",hyphenation);
        }
    }
});
