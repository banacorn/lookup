System.register(["lodash", "./template"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var _, template_1;
    var seg;
    //
    //  Formatter
    //
    function extractText(fmt) {
        return fmt.map(function (x) { return x.text; }).join("");
    }
    // make all segments italic
    function italic(fmt) {
        return fmt.map(function (seg) {
            seg.style.i = true;
            return seg;
        });
    }
    // make all segments bold
    function bold(fmt) {
        return fmt.map(function (seg) {
            seg.style.b = true;
            return seg;
        });
    }
    // make all segments link-like
    function link(fmt) {
        return fmt.map(function (seg) {
            seg.style.a = true;
            return seg;
        });
    }
    function add(fmt, text, i, b, a) {
        if (i === void 0) { i = false; }
        if (b === void 0) { b = false; }
        if (a === void 0) { a = false; }
        if (fmt.length === 0) {
            return [{
                    text: text,
                    style: { i: i, b: b, a: a }
                }];
        }
        else {
            var lastIndex = fmt.length - 1;
            var style = { i: i, b: b, a: a };
            // the style of newly added text is the same as the last segment, simply append them
            if (_.isEqual(fmt[lastIndex].style, style)) {
                fmt[lastIndex].text += text;
                return fmt;
            }
            else {
                return fmt.concat([{
                        text: text,
                        style: style
                    }]);
            }
        }
    }
    function concat(a, b) {
        if (a.length === 0) {
            return b;
        }
        else if (b.length === 0) {
            return a;
        }
        else {
            if (_.isEqual(a[a.length - 1].style, b[0].style)) {
                return a.slice(0, a.length - 1).concat([{
                        text: a[a.length - 1].text + b[0].text,
                        style: b[0].style
                    }]).concat(b.slice(1));
            }
            else {
                return a.concat(b);
            }
        }
    }
    function fold(fmt, elements, word, f) {
        if (f) {
            elements.forEach(function (e) {
                fmt = concat(fmt, f(formatElement(word)(e)));
            });
        }
        else {
            elements.forEach(function (e) {
                fmt = concat(fmt, formatElement(word)(e));
            });
        }
        return fmt;
    }
    //
    //  Formatting stuffs
    //
    function formatElement(word) {
        return function (element) {
            switch (element.kind) {
                case "plain":
                    var fmt_1 = [];
                    return add([], element.text);
                case "italic":
                    return fold([], element.subs, word, italic);
                case "bold":
                    return fold([], element.subs, word, bold);
                case "link":
                    return fold([], element.subs, word, link);
                case "template":
                    var transclusion = template_1.transclude(word, element);
                    if (transclusion) {
                        return transclusion;
                    }
                    else {
                        fmt_1 = add([], "{{" + element.name);
                        element.params.forEach(function (param) {
                            if (param.name) {
                                fmt_1 = add(fmt_1, "|" + param.name + "=");
                                fmt_1 = fold(fmt_1, param.value, word);
                            }
                            else {
                                fmt_1 = add(fmt_1, "|");
                                fmt_1 = fold(fmt_1, param.value, word);
                            }
                        });
                        fmt_1 = add(fmt_1, "}}");
                        return fmt_1;
                    }
            }
        };
    }
    function formatLine(line, order, word) {
        // ### only
        var numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
        // ends with *
        var hasBullet = line.uli > 0 && line.indent === 0;
        var bullet = "◦";
        if (line.uli % 2)
            bullet = "•";
        // const indentSpace = 4;
        var indentLevel = line.oli + line.uli + line.indent;
        var indentation = _.repeat("  ", indentLevel);
        var formattedElements = fold([], line.line, word);
        if (numbered) {
            return concat([{
                    text: "" + indentation + order + ". ",
                    style: { i: false, b: true, a: false }
                }], formattedElements);
        }
        else if (hasBullet) {
            return concat([{
                    text: "" + indentation + bullet + " ",
                    style: { i: false, b: false, a: false }
                }], formattedElements);
        }
        else {
            return concat([{
                    text: "" + indentation,
                    style: { i: false, b: false, a: false }
                }], formattedElements);
        }
    }
    function formatParagraph(word) {
        return function (result) {
            var order = [1];
            if (result.kind === "ok") {
                var fmt_2 = [];
                result.value.forEach(function (line) {
                    var numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
                    var level = line.oli;
                    if (level > order.length)
                        order.push(1);
                    else if (level < order.length)
                        order.pop();
                    fmt_2 = concat(fmt_2, formatLine(line, _.last(order), word));
                    fmt_2 = add(fmt_2, "\n");
                    if (level === order.length)
                        order[order.length - 1] += 1;
                });
                return fmt_2;
            }
            else {
                return add([], "failed to parse this paragraph\n");
            }
        };
    }
    return {
        setters:[
            function (_1) {
                _ = _1;
            },
            function (template_1_1) {
                template_1 = template_1_1;
            }],
        execute: function() {
            //
            //  Segment constructor
            //
            seg = function (s, i, b, a) {
                if (i === void 0) { i = false; }
                if (b === void 0) { b = false; }
                if (a === void 0) { a = false; }
                return {
                    text: s,
                    style: { i: i, b: b, a: a }
                };
            };
            exports_1("formatElement", formatElement);
            exports_1("formatParagraph", formatParagraph);
            exports_1("seg", seg);
            exports_1("concat", concat);
            exports_1("add", add);
            exports_1("extractText", extractText);
            exports_1("fold", fold);
        }
    }
});
