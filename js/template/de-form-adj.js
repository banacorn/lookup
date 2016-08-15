System.register(["lodash", "../fmt", "../template"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, F, template_1;
    // https://en.wiktionary.org/wiki/Template:de-form-adj
    // {{de-form-adj|s|m|g|bestimmt|nocat=1}}
    function deFormAdj(word, named, unnamed) {
        var result = [];
        var baseForm = F.extractText(_.last(unnamed));
        var degree = _.find(named, ["name", "deg"]);
        var otherParams = _.initial(unnamed);
        var declension = F.extractText(otherParams[0]);
        var gender = F.extractText(otherParams[1]);
        var fall = F.extractText(otherParams[2]);
        // degree
        template_1.find(named, "deg", function (value) {
            switch (F.extractText(value)) {
                case "c":
                    result = F.add(result, "comparative ", true);
                    break;
                case "s":
                    result = F.add(result, "superlative ", true);
                    break;
                default:
                    result = F.add(result, "unknown degree ", true);
                    break;
            }
        });
        //  declension
        if (declension) {
            switch (declension) {
                case "pc":
                    result = F.add(result, "predicative comparative ", true);
                    break;
                case "ps":
                    result = F.add(result, "predicative superlative ", true);
                    break;
                case "s":
                    result = F.add(result, "strong ", true);
                    break;
                case "w":
                    result = F.add(result, "weak ", true);
                    break;
                case "m":
                    result = F.add(result, "mixed ", true);
                    break;
                case "ms":
                case "sm":
                    result = F.add(result, "strong and mixed ", true);
                    break;
                case "smw":
                case "swm":
                case "wsm":
                case "wms":
                case "mws":
                case "msw":
                    result = F.add(result, "strong, mixed, and weak ", true);
                    break;
                case "mw":
                case "wm":
                    result = F.add(result, "mixed and weak ", true);
                    break;
                default:
                    result = F.add(result, "unknown declension ", true);
                    break;
            }
        }
        //  gender
        if (gender) {
            switch (gender) {
                case "m":
                    result = F.add(result, "masculine singular ", true);
                    break;
                case "f":
                    result = F.add(result, "feminine singular ", true);
                    break;
                case "n":
                    result = F.add(result, "neuter singular ", true);
                    break;
                case "p":
                case "pl":
                    result = F.add(result, "plural ", true);
                    break;
                default:
                    result = F.add(result, " unknown number", true);
                    break;
            }
        }
        //  fall
        if (fall) {
            switch (fall) {
                case "n":
                case "nom":
                case "nominative":
                    result = F.add(result, "nominative ", true);
                    break;
                case "g":
                case "gen":
                case "genitive":
                    result = F.add(result, "genitive ", true);
                    break;
                case "d":
                case "dat":
                case "dative":
                    result = F.add(result, "dative ", true);
                    break;
                case "a":
                case "acc":
                case "accusative":
                    result = F.add(result, "accusative ", true);
                    break;
                default:
                    result = F.add(result, "unknown case ", true);
                    break;
            }
        }
        result = F.add(result, "form of ", true);
        // baseForm
        if (baseForm) {
            result = F.add(result, baseForm + ".", false, true);
        }
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
            exports_1("default",deFormAdj);
        }
    }
});
