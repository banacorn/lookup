System.register(["lodash", "../template", "../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, template_1, F;
    // import { inspect } from "util";
    // const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);
    // {{m|language|link|link_text|translation|tr=transliteration|lit=literal_translation|pos=part_of_speech}}
    function m(word, raw) {
        var _a = template_1.sortParams(raw, word), named = _a.named, unnamed = _a.unnamed;
        var language = unnamed[0];
        var link = unnamed[1];
        var linkText = unnamed[2];
        var translation = unnamed[3];
        var transliteration = _.find(named, ["name", "tr"]);
        var partOfSpeech = _.find(named, ["name", "pos"]);
        var showedText = [];
        // showed text
        if (F.extractText(linkText))
            showedText = F.concat(showedText, F.link(F.italic(linkText)));
        else if (F.extractText(link))
            showedText = F.concat(showedText, F.link(F.italic(link)));
        var inParentheses = [F.seg(" (")];
        // transliteration
        if (transliteration && F.extractText(transliteration.value)) {
            inParentheses = F.add(inParentheses, "" + F.extractText(transliteration.value));
        }
        // translation
        if (F.extractText(translation)) {
            if (inParentheses.length > 1)
                inParentheses = F.add(inParentheses, ", ");
            inParentheses = F.add(inParentheses, "\u201C");
            inParentheses = F.concat(inParentheses, F.italic(translation));
            inParentheses = F.add(inParentheses, "\u201D");
        }
        // part of speech
        if (partOfSpeech && F.extractText(partOfSpeech.value)) {
            if (inParentheses.length > 1)
                inParentheses = F.add(inParentheses, ", ");
            switch (F.extractText(partOfSpeech.value)) {
                case "a":
                    inParentheses = F.add(inParentheses, "adj");
                    break;
                case "adv":
                    inParentheses = F.add(inParentheses, "adv");
                    break;
                case "n":
                    inParentheses = F.add(inParentheses, "noun");
                    break;
                case "verb":
                    inParentheses = F.add(inParentheses, "verb");
                    break;
                default:
                    inParentheses = F.add(inParentheses, F.extractText(partOfSpeech.value));
                    break;
            }
        }
        // // literal translation
        if (transliteration && F.extractText(transliteration.value)) {
            if (inParentheses.length > 1)
                inParentheses = F.add(inParentheses, ", ");
            inParentheses = F.add(inParentheses, "literally \u201C" + F.extractText(transliteration.value) + "\u201C");
        }
        inParentheses = F.add(inParentheses, ")");
        if (F.extractText(inParentheses) !== " ()")
            return F.concat(showedText, inParentheses);
        else
            return showedText;
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
            exports_1("default",m);
        }
    }
});
