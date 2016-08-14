System.register(["lodash", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, F;
    // const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);
    // https://en.wiktionary.org/wiki/Template:head
    // {{IPA|pronunciation 1|pronunciation 2|pronunciation 3|lang=en}}
    function head(word, named, unnamed) {
        var result = [];
        var headword = _.find(named, ["name", "head"]);
        // displayed headword
        if (headword && F.extractText(headword.value))
            result = F.add(result, "" + F.extractText(headword.value), false, true);
        else
            result = F.add(result, "" + word, false, true);
        // display undealt parameters
        var undealt = "{{head";
        unnamed.slice(2).forEach(function (value) {
            undealt += "|" + F.extractText(value);
        });
        var dealtNamed = [
            { name: "head" }
        ];
        _.pullAllBy(named, dealtNamed, "name").forEach(function (pair) {
            undealt += "|" + pair.name + " = " + F.extractText(F.fold([], pair.value, word));
        });
        undealt += "}}";
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
            exports_1("default",head);
        }
    }
});
