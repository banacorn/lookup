System.register(["lodash", "../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, template_1, F;
    function deNoun(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        var result = [F.seg(word + " ", false, true)];
        var genderForm = parseGender(unnamed[0]);
        result = F.add(result, "" + genderForm, true, false, true);
        var otherGenderForms = named
            .filter(function (_a) {
            var name = _a.name, value = _a.value;
            return /^g\d+/.test(name);
        })
            .map(function (_a) {
            var name = _a.name, value = _a.value;
            return parseGender(value);
        });
        otherGenderForms.forEach(function (form) {
            result = F.add(result, ", ", false, false, false);
            result = F.add(result, "" + form, true, false, true);
        });
        var genitiveForm = determineGenitive(unnamed[1], _.concat([genderForm], otherGenderForms), word);
        result = F.add(result, " (", false, false, false);
        result = F.add(result, "genitive", true, false, false);
        result = F.add(result, " " + genitiveForm, false, false, false);
        var otherGenitiveForms = named
            .filter(function (_a) {
            var name = _a.name, value = _a.value;
            return /^gen\d+/.test(name);
        })
            .map(function (_a) {
            var name = _a.name, value = _a.value;
            return F.extractText(value);
        });
        otherGenitiveForms.forEach(function (form) {
            result = F.add(result, " or", true, false, false);
            result = F.add(result, " " + form, false, false, false);
        });
        var pluralForm = determinePlural(unnamed[2], word);
        if (pluralForm) {
            result = F.add(result, ", ", false, false, false);
            result = F.add(result, "plural", true, false, false);
            result = F.add(result, " " + pluralForm, false, false, false);
        }
        else {
            result = F.add(result, ", ", false, false, false);
            result = F.add(result, "no plural", true, false, false);
        }
        var otherPluralForms = named
            .filter(function (_a) {
            var name = _a.name, value = _a.value;
            return /^pl\d+/.test(name);
        })
            .map(function (_a) {
            var name = _a.name, value = _a.value;
            return F.extractText(value);
        });
        otherPluralForms.forEach(function (form) {
            result = F.add(result, " or", true, false, false);
            result = F.add(result, " " + form, false, false, false);
        });
        var diminutiveForm = determineDiminutive(unnamed[3]);
        if (diminutiveForm) {
            result = F.add(result, ", ", false, false, false);
            result = F.add(result, "diminutive", true, false, false);
            result = F.add(result, " " + diminutiveForm + " ", false, false, false);
            result = F.add(result, "n", true, false, true);
        }
        var feminineForm = determineFeminineForm(named);
        if (feminineForm) {
            result = F.add(result, ", ", false, false, false);
            result = F.add(result, "feminine", true, false, false);
            result = F.add(result, " " + feminineForm, false, false, false);
        }
        var masculineForm = determineMasculineForm(named);
        if (masculineForm) {
            result = F.add(result, ", ", false, false, false);
            result = F.add(result, "masculine", true, false, false);
            result = F.add(result, " " + masculineForm, false, false, false);
        }
        result = F.add(result, ")", false, false, false);
        return result;
    }
    function determineGenitive(raw, genderForms, word) {
        if (_.isEmpty(raw)) {
            if (_.includes(genderForms, "m") || _.includes(genderForms, "n")) {
                return word + "s";
            }
            else {
                return "" + word;
            }
        }
        else {
            return F.extractText(raw);
        }
    }
    function determinePlural(raw, word) {
        if (_.isEmpty(raw)) {
            return word + "en";
        }
        else if (F.extractText(raw) === "-") {
            return undefined;
        }
        else {
            return F.extractText(raw);
        }
    }
    function determineDiminutive(raw) {
        if (_.isEmpty(raw)) {
            return undefined;
        }
        else {
            return F.extractText(raw);
        }
    }
    function determineFeminineForm(named) {
        var pair = _.find(named, ["name", "f"]);
        if (pair) {
            return F.extractText(pair.value);
        }
    }
    function determineMasculineForm(named) {
        var pair = _.find(named, ["name", "m"]);
        if (pair) {
            return F.extractText(pair.value);
        }
    }
    function parseGender(raw) {
        return F.extractText(raw).substr(0, 1);
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
            exports_1("default",deNoun);
        }
    }
});
