System.register(["lodash", "../fmt", "../template"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, F, template_1;
    // https://en.wiktionary.org/wiki/Template:head
    // {{IPA|pronunciation 1|pronunciation 2|pronunciation 3|lang=en}}
    function head(word, named, unnamed) {
        var result = [];
        var dealtNames = [];
        // displayed headword
        template_1.find(named, "head", function (value) {
            result = F.add(result, F.extractText(value) + " ", false, true);
            dealtNames.push("head");
        }, function () {
            result = F.add(result, word + " ", false, true);
        });
        // gender
        template_1.findEnum(named, "g", function (value, i, key) {
            result = F.add(result, "" + F.extractText(value), true, false, true);
            dealtNames.push(key);
        });
        // display undealt parameters
        var undealt = "{{head";
        unnamed.slice(2).forEach(function (value) {
            undealt += "|" + F.extractText(value);
        });
        var undealtNames = named
            .filter(function (pair) { return !_.includes(dealtNames, pair.name); })
            .map(function (pair) { return pair.name; });
        template_1.find(named, undealtNames, function (value, key) {
            undealt += "|" + key + " = " + F.extractText(value);
        });
        undealt += "}}";
        if (undealt !== '{{head}}')
            result = F.add(result, undealt);
        return result;
    }
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (F_1) {
                F = F_1;
            },
            function (template_1_1) {
                template_1 = template_1_1;
            }],
        execute: function() {
            exports_1("default",head);
        }
    }
});
