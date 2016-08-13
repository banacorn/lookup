System.register(["./../type", "colors"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var type_1;
    function printEntry(entry) {
        var sections = type_1.flattenSection(entry);
        sections.forEach(function (section) {
            console.log(("== " + section.header + " ==").yellow);
            section.body.forEach(function (paragraph) {
                printFmt(paragraph);
            });
        });
    }
    function printFmt(fmt) {
        var text = "";
        var texts = fmt.map(function (seg) {
            var result = seg.text || "";
            if (seg.style.i)
                result = result["italic"];
            if (seg.style.b)
                result = result["bold"];
            if (seg.style.a)
                result = result["underline"];
            text += result;
        });
        console.log(text);
    }
    return {
        setters:[
            function (type_1_1) {
                type_1 = type_1_1;
            },
            function (_1) {}],
        execute: function() {
            exports_1("printEntry", printEntry);
        }
    }
});
