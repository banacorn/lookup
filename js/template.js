System.register(["lodash", "./fmt", "./template/a", "./template/audio", "./template/compound", "./template/de-noun", "./template/de-verb-form-of", "./template/de-form-adj", "./template/de-inflected-form-of", "./template/etyl", "./template/head", "./template/homophones", "./template/hyphenation", "./template/label", "./template/mention", "./template/prefix", "./template/ipa", "./template/rhymes", "util"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, F, a_1, audio_1, compound_1, de_noun_1, de_verb_form_of_1, de_form_adj_1, de_inflected_form_of_1, etyl_1, head_1, homophones_1, hyphenation_1, label_1, mention_1, prefix_1, ipa_1, rhymes_1, util_1;
    var debug;
    function sortParams(params, word) {
        var unnamed = [];
        var named = [];
        params.forEach(function (param) {
            var valueFmt = F.fold([], param.value, word);
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
    function find(named, rawKeys, callback, fallback) {
        var keys;
        if (rawKeys instanceof Array) {
            keys = rawKeys;
        }
        else {
            keys = [rawKeys];
        }
        var values = named.filter(function (pair) { return _.includes(keys, pair.name); });
        if (_.head(values)) {
            callback(_.head(values).value, _.head(values).name);
        }
        else {
            if (fallback)
                fallback();
        }
    }
    function findEnum(named, rawKeys, callback) {
        var keys;
        if (rawKeys instanceof Array) {
            keys = rawKeys;
        }
        else {
            keys = [rawKeys];
        }
        var values = [];
        named.forEach(function (pair) {
            keys.forEach(function (key) {
                if (_.startsWith(pair.name, key)) {
                    var match = pair.name.substr(key.length).match(/^(\d*)$/);
                    if (match) {
                        values.push({
                            key: key,
                            value: pair.value,
                            index: parseInt(match[1])
                        });
                    }
                }
            });
        });
        values.forEach(function (_a) {
            var value = _a.value, index = _a.index, key = _a.key;
            return callback(value, index, key);
        });
        return values.map(function (_a) {
            var value = _a.value;
            return value;
        });
    }
    // https://en.wiktionary.org/wiki/Template:de-noun
    function transclude(word, template) {
        var _a = sortParams(template.params, word), named = _a.named, unnamed = _a.unnamed;
        switch (template.name) {
            case "a": return a_1.default(word, named, unnamed);
            case "audio": return audio_1.default(word, named, unnamed);
            case "compound": return compound_1.default(word, named, unnamed);
            case "de-noun": return de_noun_1.default(word, named, unnamed);
            case "de-verb form of": return de_verb_form_of_1.default(word, named, unnamed);
            case "de-form-adj": return de_form_adj_1.default(word, named, unnamed);
            case "de-inflected form of": return de_inflected_form_of_1.default(word, named, unnamed);
            case "etyl": return etyl_1.default(word, named, unnamed);
            case "head": return head_1.default(word, named, unnamed);
            case "homophones": return homophones_1.default(word, named, unnamed);
            case "hyphenation": return hyphenation_1.default(word, named, unnamed);
            case "lb":
            case "lbl":
            case "lable":
                return label_1.default(word, named, unnamed);
            case "m":
            case "mention":
                return mention_1.default(word, named, unnamed);
            case "prefix": return prefix_1.default(word, named, unnamed);
            case "IPA": return ipa_1.default(word, named, unnamed);
            case "rhymes": return rhymes_1.default(word, named, unnamed);
        }
        return undefined;
    }
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (F_1) {
                F = F_1;
            },
            function (a_1_1) {
                a_1 = a_1_1;
            },
            function (audio_1_1) {
                audio_1 = audio_1_1;
            },
            function (compound_1_1) {
                compound_1 = compound_1_1;
            },
            function (de_noun_1_1) {
                de_noun_1 = de_noun_1_1;
            },
            function (de_verb_form_of_1_1) {
                de_verb_form_of_1 = de_verb_form_of_1_1;
            },
            function (de_form_adj_1_1) {
                de_form_adj_1 = de_form_adj_1_1;
            },
            function (de_inflected_form_of_1_1) {
                de_inflected_form_of_1 = de_inflected_form_of_1_1;
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
            function (hyphenation_1_1) {
                hyphenation_1 = hyphenation_1_1;
            },
            function (label_1_1) {
                label_1 = label_1_1;
            },
            function (mention_1_1) {
                mention_1 = mention_1_1;
            },
            function (prefix_1_1) {
                prefix_1 = prefix_1_1;
            },
            function (ipa_1_1) {
                ipa_1 = ipa_1_1;
            },
            function (rhymes_1_1) {
                rhymes_1 = rhymes_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            }],
        execute: function() {
            debug = function (s, color) {
                if (color === void 0) { color = "cyan"; }
                return console.log(util_1.inspect(s, false, null)[color]);
            };
            exports_1("transclude", transclude);
            exports_1("sortParams", sortParams);
            exports_1("find", find);
            exports_1("findEnum", findEnum);
        }
    }
});
