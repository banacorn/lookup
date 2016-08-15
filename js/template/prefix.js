System.register(["../fmt", "./compound"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F, compound_1;
    // https://en.wiktionary.org/wiki/Template:prefix
    // {{prefix|language code|prefix|root}}
    function prefix(word, named, unnamed) {
        // add "-" to prefix
        unnamed[0] = F.add(unnamed[0], "-");
        return compound_1.default(word, named, unnamed);
        // let result = [];
        //
        // let prefix = F.extractText(unnamed[0]);
        // let root = F.extractText(unnamed[1]);
        //
        // // displayed prefix
        // find(named, "alt1", (value) => {
        //     // alternation found
        //     result = F.add(result, `${F.extractText(value)}- `, false, true);
        // }, () => {
        //     // alternation not found
        //     result = F.add(result, `${prefix}- `, false, true);
        // })
        //
        // let prefixMisc = [F.seg(`(`)];
        // let prefixMiscComma = false;
        //
        // // prefix transliteration
        // find(named, "tr1", (value) => {
        //     prefixMisc = F.add(prefixMisc, `${F.extractText(value)}`, true);
        //     prefixMiscComma = true;
        // })
        //
        // // prefix glosses
        // find(named, ["t1", "gloss1"], (value) => {
        //     if (prefixMiscComma)
        //         prefixMisc = F.add(prefixMisc, `, `);
        //     prefixMisc = F.add(prefixMisc, `“${F.extractText(value)}”`);
        //     prefixMiscComma = true;
        // })
        //
        // // prefix POS
        // find(named, "pos1", (value) => {
        //     if (prefixMiscComma)
        //         prefixMisc = F.add(prefixMisc, `, `);
        //     prefixMisc = F.add(prefixMisc, `${F.extractText(value)}`);
        //     prefixMiscComma = true;
        // })
        //
        // prefixMisc = F.add(prefixMisc, `) `);
        //
        // if (F.extractText(prefixMisc) !== "() ")
        //     result = F.concat(result, prefixMisc);
        //
        // // displayed root
        // find(named, "alt2", (value) => {
        //     // alternation found
        //     result = F.add(result, `+ ${F.extractText(value)} `, false, true);
        // }, () => {
        //     // alternation not found
        //     result = F.add(result, `+ ${root} `, false, true);
        // })
        //
        // let rootMisc = [F.seg(`(`)];
        // let rootMiscComma = false;
        //
        // // root transliteration
        // find(named, "tr2", (value) => {
        //     rootMisc = F.add(rootMisc, `${F.extractText(value)}`, true);
        //     rootMiscComma = true;
        // })
        //
        // // root glosses
        // find(named, ["t2", "gloss2"], (value) => {
        //     if (rootMiscComma)
        //         rootMisc = F.add(rootMisc, `, `);
        //     rootMisc = F.add(rootMisc, `“${F.extractText(value)}”`);
        //     rootMiscComma = true;
        // })
        //
        // // root POS
        // find(named, "pos2", (value) => {
        //     if (rootMiscComma)
        //         rootMisc = F.add(rootMisc, `, `);
        //     rootMisc = F.add(rootMisc, `${F.extractText(value)}`);
        //     rootMiscComma = true;
        // })
        // rootMisc = F.add(rootMisc, `)`);
        //
        // if (F.extractText(rootMisc) !== "()")
        //     result = F.concat(result, rootMisc);
        // return result;
    }
    return {
        setters:[
            function (F_1) {
                F = F_1;
            },
            function (compound_1_1) {
                compound_1 = compound_1_1;
            }],
        execute: function() {
            exports_1("default",prefix);
        }
    }
});
