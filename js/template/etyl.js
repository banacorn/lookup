System.register(["../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var template_1, F;
    // import { inspect } from "util";
    // const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);
    // {{etyl|src|dst}}
    function etyl(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        var src = F.extractText(unnamed[0]);
        var dst = F.extractText(unnamed[1]);
        var srcName = languageCode(src);
        if (srcName) {
            return [
                F.seg("" + srcName, true, false, false)
            ];
        }
        else {
            return [
                F.seg("{{etyl|" + src + "|" + dst + "}}", true, false, false)
            ];
        }
    }
    function languageCode(code) {
        switch (code) {
            // case "": return "";
            case "ang": return "Old English";
            case "cel-gau": return "Gaulish";
            case "cel-pro": return "Proto-Celtic";
            case "de": return "German";
            case "enm": return "Middle English";
            case "fro": return "Old French";
            case "gem-pro": return "Proto-Germanic";
            case "gmh": return "Middle High German";
            case "gml": return "Middle Low German";
            case "goh": return "Old High German";
            case "ine-pro": return "Proto-Indo-European";
            case "la": return "Latin";
            case "osx": return "Old Saxon";
            default: return undefined;
        }
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
            exports_1("default",etyl);
        }
    }
});
