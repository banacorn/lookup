System.register(["../fmt", "../template"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F, template_1;
    // https://en.wiktionary.org/wiki/Template:prefix
    // {{prefix|language code|prefix|root}}
    function prefix(word, named, unnamed) {
        var result = [];
        var prefix = F.extractText(unnamed[0]);
        var root = F.extractText(unnamed[1]);
        // displayed prefix
        template_1.find(named, "alt1", function (value) {
            // alternation found
            result = F.add(result, F.extractText(value) + "- ", false, true);
        }, function () {
            // alternation not found
            result = F.add(result, prefix + "- ", false, true);
        });
        var prefixMisc = [F.seg("(")];
        var prefixMiscComma = false;
        // prefix transliteration
        template_1.find(named, "tr1", function (value) {
            prefixMisc = F.add(prefixMisc, "" + F.extractText(value), true);
            prefixMiscComma = true;
        });
        // prefix glosses
        template_1.find(named, ["t1", "gloss1"], function (value) {
            if (prefixMiscComma)
                prefixMisc = F.add(prefixMisc, ", ");
            prefixMisc = F.add(prefixMisc, "\u201C" + F.extractText(value) + "\u201D");
            prefixMiscComma = true;
        });
        // prefix POS
        template_1.find(named, "pos1", function (value) {
            if (prefixMiscComma)
                prefixMisc = F.add(prefixMisc, ", ");
            prefixMisc = F.add(prefixMisc, "" + F.extractText(value));
            prefixMiscComma = true;
        });
        prefixMisc = F.add(prefixMisc, ")");
        if (F.extractText(prefixMisc) !== "()")
            result = F.concat(result, prefixMisc);
        // displayed root
        template_1.find(named, "alt2", function (value) {
            // alternation found
            result = F.add(result, " + " + F.extractText(value) + " ", false, true);
        }, function () {
            // alternation not found
            result = F.add(result, " + " + root + " ", false, true);
        });
        var rootMisc = [F.seg("(")];
        var rootMiscComma = false;
        // root transliteration
        template_1.find(named, "tr2", function (value) {
            rootMisc = F.add(rootMisc, "" + F.extractText(value), true);
            rootMiscComma = true;
        });
        // root glosses
        template_1.find(named, ["t2", "gloss2"], function (value) {
            if (rootMiscComma)
                rootMisc = F.add(rootMisc, ", ");
            rootMisc = F.add(rootMisc, "\u201C" + F.extractText(value) + "\u201D");
            rootMiscComma = true;
        });
        // root POS
        template_1.find(named, "pos2", function (value) {
            if (rootMiscComma)
                rootMisc = F.add(rootMisc, ", ");
            rootMisc = F.add(rootMisc, "" + F.extractText(value));
            rootMiscComma = true;
        });
        rootMisc = F.add(rootMisc, ")");
        if (F.extractText(rootMisc) !== "()")
            result = F.concat(result, rootMisc);
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
            exports_1("default",prefix);
        }
    }
});
