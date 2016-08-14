System.register(["../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var fmt_1, F;
    // https://en.wiktionary.org/wiki/Template:label
    // {{lb|en|AU|slang}}
    function label(word, named, unnamed) {
        var result = [fmt_1.seg("(")];
        var commaNext = false;
        // labels
        unnamed.forEach(function (label, i) {
            if (commaNext) {
                result = F.add(result, ", ");
            }
            if (i === 0) {
                commaNext = true;
            }
            var text = F.extractText(label);
            switch (text) {
                case "_":
                    commaNext = false;
                    result = F.add(result, " ");
                    break;
                case "or":
                    commaNext = false;
                    result = F.add(result, " or ");
                    break;
                case "and":
                    commaNext = false;
                    result = F.add(result, " and ");
                    break;
                default:
                    result = F.add(result, "" + text);
                    commaNext = true;
                    break;
            }
        });
        result = F.add(result, ")");
        return result;
    }
    return {
        setters:[
            function (fmt_1_1) {
                fmt_1 = fmt_1_1;
                F = fmt_1_1;
            }],
        execute: function() {
            exports_1("default",label);
        }
    }
});
