System.register(["lodash", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, F;
    // https://en.wiktionary.org/wiki/Template:hyphenation
    // {{hyphenation|knowl|edge|caption=Hyphenation US|lang=en}}
    function hyphenation(word, named, unnamed) {
        var result = [];
        var caption = _.find(named, ["name", "caption"]);
        // caption
        if (caption && F.extractText(caption.value))
            result = F.add(result, F.extractText(caption.value) + ": ");
        else
            result = F.add(result, "Hyphenation: ");
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
            function (F_1) {
                F = F_1;
            }],
        execute: function() {
            exports_1("default",hyphenation);
        }
    }
});
