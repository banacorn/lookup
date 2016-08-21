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
        case 'italic':
            return x.body.map(inlineToText).join('');
        default:
            return '';
    }
}
exports.inlineToText = inlineToText;
function blockToText(node) {
    switch (node.kind) {
        case 'paragraph':
            return node.body.map(inlineToText).join('');
        default:
            return "<unknown block element>";
    }
}
exports.blockToText = blockToText;
//# sourceMappingURL=types.js.map