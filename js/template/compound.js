System.register(["../fmt", "../template"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F, template_1;
    // import { inspect } from "util";
    // const debug = (s: any, color = "cyan") => console.log(inspect(s, false, null)[color]);
    // https://en.wiktionary.org/wiki/Template:compound
    // {{compound|(language code)|first part|second part|optionally more parts}}
    function compound(word, named, unnamed) {
        // displayed texts
        var components = unnamed.map(F.italic);
        // search for alternative texts
        template_1.findEnum(named, "alt", function (value, i, key) {
            // replace with alternative text
            components[i - 1] = value;
        });
        // initalize miscs with []s
        var componentMiscs = components.map(function () { return []; });
        // transliterations
        template_1.findEnum(named, "tr", function (value, i, key) {
            componentMiscs[i - 1].push(value);
        });
        // glosses
        template_1.findEnum(named, ["t", "gloss"], function (value, i, key) {
            var gloss = [];
            gloss = F.add(gloss, "\u201C");
            gloss = F.concat(gloss, value);
            gloss = F.add(gloss, "\u201D");
            componentMiscs[i - 1].push(gloss);
        });
        // POS
        template_1.findEnum(named, "pos", function (value, i, key) {
            componentMiscs[i - 1].push(value);
        });
        // join miscs with commas ", "
        var delimetedMiscs = componentMiscs.map(function (miscs) {
            return F.join(miscs, [F.seg(", ")]);
        });
        // component + (misc ...)
        var joinedWithMiscs = components.map(function (component, i) {
            if (delimetedMiscs[i].length > 0)
                return F.concat(component, F.concat([F.seg(" ")], F.parentheses(delimetedMiscs[i])));
            else
                return component;
        });
        return F.join(joinedWithMiscs, [F.seg(" + ")]);
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
            exports_1("default",compound);
        }
    }
});
