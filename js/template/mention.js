System.register(["../fmt", "../template"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F, template_1;
    // https://en.wiktionary.org/wiki/Template:mention
    // {{m|language|link|link_text|translation|tr=transliteration|lit=literal_translation|pos=part_of_speech}}
    function mention(word, named, unnamed) {
        var language = unnamed[0];
        var link = unnamed[1];
        var linkText = unnamed[2];
        var translation = unnamed[3];
        var showedText = [];
        // showed text
        if (F.extractText(linkText))
            showedText = F.concat(showedText, F.link(F.italic(linkText)));
        else if (F.extractText(link))
            showedText = F.concat(showedText, F.link(F.italic(link)));
        var misc = [F.seg(" (")];
        var miscComma = false;
        // transliteration
        template_1.find(named, "tr", function (value) {
            misc = F.add(misc, "" + F.extractText(value));
            miscComma = true;
        });
        // translation
        if (F.extractText(translation)) {
            if (miscComma)
                misc = F.add(misc, ", ");
            misc = F.add(misc, "\u201C");
            misc = F.concat(misc, F.italic(translation));
            misc = F.add(misc, "\u201D");
            miscComma = true;
        }
        // part of speech
        template_1.find(named, "pos", function (value) {
            if (miscComma)
                misc = F.add(misc, ", ");
            switch (F.extractText(value)) {
                case "a":
                    misc = F.add(misc, "adj");
                    break;
                case "adv":
                    misc = F.add(misc, "adv");
                    break;
                case "n":
                    misc = F.add(misc, "noun");
                    break;
                case "verb":
                    misc = F.add(misc, "verb");
                    break;
                default:
                    misc = F.add(misc, F.extractText(value));
                    break;
            }
            miscComma = true;
        });
        // literal translation
        template_1.find(named, "lit", function (value) {
            if (miscComma)
                misc = F.add(misc, ", ");
            misc = F.add(misc, "literally \u201C" + F.extractText(value) + "\u201C");
            miscComma = true;
        });
        misc = F.add(misc, ")");
        if (F.extractText(misc) !== " ()")
            return F.concat(showedText, misc);
        else
            return showedText;
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
            exports_1("default",mention);
        }
    }
});
