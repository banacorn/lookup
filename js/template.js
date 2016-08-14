System.register(["./fmt", "./template/audio", "./template/de-noun", "./template/etyl", "./template/head", "./template/homophones", "./template/m", "./template/ipa", "./template/rhymes"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var fmt_1, audio_1, de_noun_1, etyl_1, head_1, homophones_1, m_1, ipa_1, rhymes_1;
    function sortParams(params, word) {
        var unnamed = [];
        var named = [];
        params.forEach(function (param) {
            var valueFmt = fmt_1.fold([], param.value, word);
            if (param.name === "") {
                unnamed.push(valueFmt);
            }
            else {
                named.push({
                    name: param.name,
                    value: valueFmt
                });
            }
        });
        return {
            named: named,
            unnamed: unnamed
        };
    }
    // https://en.wiktionary.org/wiki/Template:de-noun
    function transclude(word, template) {
        switch (template.name) {
            case "audio": return audio_1.default(word, template.params);
            case "de-noun": return de_noun_1.default(word, template.params);
            case "etyl": return etyl_1.default(word, template.params);
            case "head": return head_1.default(word, template.params);
            case "homophones": return homophones_1.default(word, template.params);
            case "m": return m_1.default(word, template.params);
            case "IPA": return ipa_1.default(word, template.params);
            case "rhymes": return rhymes_1.default(word, template.params);
        }
        return undefined;
    }
    return {
        setters:[
            function (fmt_1_1) {
                fmt_1 = fmt_1_1;
            },
            function (audio_1_1) {
                audio_1 = audio_1_1;
            },
            function (de_noun_1_1) {
                de_noun_1 = de_noun_1_1;
            },
            function (etyl_1_1) {
                etyl_1 = etyl_1_1;
            },
            function (head_1_1) {
                head_1 = head_1_1;
            },
            function (homophones_1_1) {
                homophones_1 = homophones_1_1;
            },
            function (m_1_1) {
                m_1 = m_1_1;
            },
            function (ipa_1_1) {
                ipa_1 = ipa_1_1;
            },
            function (rhymes_1_1) {
                rhymes_1 = rhymes_1_1;
            }],
        execute: function() {
            exports_1("transclude", transclude);
            exports_1("sortParams", sortParams);
        }
    }
});
