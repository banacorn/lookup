System.register(["lodash", "../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, template_1, F;
    // {{de-noun|Gender|Genitive|Plural|Diminutive|Gendered forms}}
    function deNoun(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        var result = [F.seg(word + " ", false, true)];
        //  == Gender ==
        //  "Use m as the first parameter to indicate masculine gender, f for
        //  feminine, n for neuter. To specify more than one gender, use g2= or g3=.
        //  If you're not sure about the gender, use g as the gender or just leave
        //  it empty."
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
        //  == Genitive ==
        //  Use the second parameter to specify the genitive form of the noun.
        //  If left empty, it defaults to the headword + s if it's masculine or
        //  neuter, and to the headword alone if it's feminine.
        //  Additional genitive forms can be added with gen2= and gen3=.
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
        //  == Plural ==
        //  Use the third parameter to specify the plural form of the noun.
        //  If left empty, it defaults to the headword + en. It can also be set to
        //  - to indicate there is no plural form for this noun.
        //  Additional plural forms can be added with pl2= and pl3=.
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
        //  == Diminutive ==
        //  Use the fourth parameter to specify the diminituve form of the noun.
        //  If left empty, no diminutive is displayed.
        //  Additional diminutive forms can be added with dim2=.
        var diminutiveForm = determineDiminutive(unnamed[3]);
        if (diminutiveForm) {
            result = F.add(result, ", ", false, false, false);
            result = F.add(result, "diminutive", true, false, false);
            result = F.add(result, " " + diminutiveForm + " ", false, false, false);
            result = F.add(result, "n", true, false, true);
        }
        //  == Gendered forms ==
        //  Use f= to specify the equivalent feminine form of a masculine noun.
        //  Use m= to specify the equivalent masculine form of a feminine noun.
        //  These are used especially with nouns denoting professions.
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
        // use default
        if (_.isEmpty(raw)) {
            if (_.includes(genderForms, "m") || _.includes(genderForms, "n")) {
                return word + "s"; // headword + s
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
        // use default
        if (_.isEmpty(raw)) {
            return word + "en"; // headword + en
        }
        else if (F.extractText(raw) === "-") {
            return undefined;
        }
        else {
            return F.extractText(raw);
        }
    }
    function determineDiminutive(raw) {
        // use default
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
        // switch (F.extractText(raw)) {
        //     case "m": return "masculine";
        //     case "m-s": return "masculine";
        //     case "m-p": return "masculine";
        //     case "f": return "feminine";
        //     case "f-s": return "feminine";
        //     case "f-p": return "feminine";
        //     case "n": return "neuter";
        //     case "n-s": return "neuter";
        //     case "n-p": return "neuter";
        //     case "?-p": return "?";
        //     case "?-s": return "?";
        //     case "?-p": return "?";
        //     case "p": return "?";
        //     default: return "?";
        // }
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
