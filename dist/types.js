"use strict";
function mapSection(f, _a) {
    var name = _a.name, body = _a.body, subs = _a.subs;
    return {
        name: name,
        body: f(body),
        subs: subs.map(function (s) { return mapSection(f, s); })
    };
}
exports.mapSection = mapSection;
function inlineToText(x) {
    switch (x.kind) {
        case 'plain':
            return x.text;
        case 'i':
            return x.body.map(inlineToText).join('');
        case 'a':
            return x.body.map(inlineToText).join('');
        default:
            return '';
    }
}
exports.inlineToText = inlineToText;
function blockToText(node) {
    switch (node.kind) {
        case 'p':
            return node.body.map(inlineToText).join('');
        case 'ul':
            return node.body.map(blockToText).join('\n');
        case 'li':
            return node.body.map(inlineToText).join('');
        default:
            return "<unknown block element>";
    }
}
exports.blockToText = blockToText;
//# sourceMappingURL=types.js.map