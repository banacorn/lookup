System.register(["../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F;
    // https://en.wiktionary.org/wiki/Template:de-verb_form_of
    // {{de-verb form of|1|2|3|4}}
    function deVerbFormOf(word, named, unnamed) {
        var result = [];
        var infinitive = F.extractText(unnamed[0]);
        var person = F.extractText(unnamed[1]);
        var number = F.extractText(unnamed[2]);
        var tense = F.extractText(unnamed[3]);
        var subordinateClause = F.extractText(unnamed[4]);
        //  person
        if (person) {
            switch (person) {
                case "1":
                    result = F.add(result, "first person", true);
                    break;
                case "2":
                    result = F.add(result, "second person", true);
                    break;
                case "3":
                    result = F.add(result, "third person", true);
                    break;
                case "pr":
                    result = F.add(result, "present participle", true);
                    break;
                case "pp":
                    result = F.add(result, "past participle", true);
                    break;
                case "i":
                    result = F.add(result, "imperative", true);
                    break;
                default:
                    result = F.add(result, "unknown person", true);
                    break;
            }
        }
        //  number
        if (number) {
            switch (number) {
                case "s":
                    result = F.add(result, " singular", true);
                    break;
                case "p":
                    result = F.add(result, " plural", true);
                    break;
                default:
                    result = F.add(result, " unknown number", true);
                    break;
            }
        }
        //  tense
        if (tense) {
            switch (tense) {
                case "g":
                    result = F.add(result, " present", true);
                    break;
                case "v":
                    result = F.add(result, " preterite", true);
                    break;
                case "k1":
                    result = F.add(result, " subjunctive I", true);
                    break;
                case "k2":
                    result = F.add(result, " subjunctive II", true);
                    break;
                default:
                    result = F.add(result, " unknown tense", true);
                    break;
            }
        }
        // subordinate clause
        if (subordinateClause) {
            result = F.add(result, " subordinate clause form", true);
        }
        result = F.add(result, " of", true);
        // infinitive
        if (infinitive) {
            result = F.add(result, " " + infinitive + ".", false, true);
        }
        return result;
    }
    return {
        setters:[
            function (F_1) {
                F = F_1;
            }],
        execute: function() {
            exports_1("default",deVerbFormOf);
        }
    }
});
