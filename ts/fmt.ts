import * as _ from "lodash";
import { Fmt, AST, ParsedParagraph, Section, Seg } from "./type";
import { transclude } from "./template";

//
//  Formatter
//

function extractText(fmt: Fmt): string {
    if (fmt)
        return fmt.map(x => x.text).join("");
    else
        return "";
}

// make all segments italic
function italic(fmt: Fmt): Fmt {
    return fmt.map((seg) => {
        seg.style.i = true;
        return seg;
    });
}

// make all segments bold
function bold(fmt: Fmt): Fmt {
    return fmt.map((seg) => {
        seg.style.b = true;
        return seg;
    });
}

// make all segments link-like
function link(fmt: Fmt): Fmt {
    return fmt.map((seg) => {
        seg.style.a = true;
        return seg;
    });
}


function add(fmt: Fmt, text: string, i: boolean = false, b: boolean = false, a: boolean = false): Fmt {
    if (fmt.length === 0) {
        return [{
            text: text,
            style: { i: i, b: b, a: a }
        }];
    } else {
        const lastIndex = fmt.length - 1;
        const style = { i: i, b: b, a: a };
        // the style of newly added text is the same as the last segment, simply append them
        if (_.isEqual(fmt[lastIndex].style, style)) {
            fmt[lastIndex].text += text;
            return fmt;
        } else {
            return fmt.concat([{
                text: text,
                style: style
            }]);
        }
    }
}

function concat(a: Fmt, b: Fmt): Fmt {
    if (a.length === 0) {
        return b;
    } else if (b.length === 0) {
        return a;
    } else {
        if (_.isEqual(a[a.length - 1].style, b[0].style)) {
            return a.slice(0, a.length - 1).concat([{
                text: a[a.length - 1].text + b[0].text,
                style: b[0].style
            }]).concat(b.slice(1));
        } else {
            return a.concat(b);
        }
    }
}

function fold(fmt: Fmt, elements: AST.Inline[], word: string, f?: (x: Fmt) => Fmt): Fmt {
    if (f) {
        elements.forEach((e) => {
            fmt = concat(fmt, f(formatElement(word)(e)));
        });
    } else {
        elements.forEach((e) => {
            fmt = concat(fmt, formatElement(word)(e));
        });
    }
    return fmt;
}

//
//  Formatting stuffs
//


function formatElement(word: string): (element: AST.Inline) => Fmt {
    return function(element: AST.Inline): Fmt {
        switch (element.kind) {
            case "plain":
                let fmt = [];
                return add([], element.text);
            case "italic":
                return fold([], element.subs, word, italic);
            case "bold":
                return fold([], element.subs, word, bold);
            case "link":
                return fold([], element.subs, word, link);
            case "template":
                const transclusion = transclude(word, element);
                if (transclusion) {
                    return transclusion;
                } else {
                    fmt = add([], `{{${element.name}`);
                    element.params.forEach((param) => {
                        if (param.name) {       // named
                            fmt = add(fmt, `|${param.name}=`);
                            fmt = fold(fmt, param.value, word);
                        } else {                // unnamed
                            fmt = add(fmt, `|`);
                            fmt = fold(fmt, param.value, word);
                        }
                    });
                    fmt = add(fmt, `}}`);
                    return fmt
                }
        }
    }
}

function formatLine(line: AST.Line, order: number, word: string): Fmt {
    // ### only
    const numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
    // ends with *
    const hasBullet = line.uli > 0 && line.indent === 0;
    let bullet = "◦";
    if (line.uli % 2)
        bullet = "•";
    // const indentSpace = 4;
    const indentLevel = line.oli + line.uli + line.indent;
    const indentation = _.repeat("  ", indentLevel);

    const formattedElements: Fmt = fold([], line.line, word);
    if (numbered) {
        return concat([{
            text: `${indentation}${order}. `,
            style: { i: false, b: true, a: false }
        }], formattedElements);
    } else if (hasBullet) {
        return concat([{
            text: `${indentation}${bullet} `,
            style: { i: false, b: false, a: false }
        }], formattedElements);
    } else {
        return concat([{
            text: `${indentation}`,
            style: { i: false, b: false, a: false }
        }], formattedElements);
    }
}


function formatParagraph(word: string): (result: ParsedParagraph) => Fmt {
    return function(result: ParsedParagraph): Fmt {
        let order = [1];
        if (result.kind === "ok") {
            let fmt = [];
            result.value.forEach((line) => {
                const numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
                const level = line.oli;
                if (level > order.length)   // indent
                    order.push(1);
                else if (level < order.length)
                    order.pop();

                fmt = concat(fmt, formatLine(line, _.last(order), word));
                fmt = add(fmt, "\n");
                if (level === order.length)
                    order[order.length - 1] += 1;
            });
            return fmt;
        } else {
            return add([], "failed to parse this paragraph\n");
        }
    }
}

//
//  Segment constructor
//

const seg = (s: string, i: boolean = false, b: boolean = false, a: boolean = false) => <Seg>{
    text: s,
    style: { i: i, b: b, a: a }
}


export {
    formatElement,
    formatParagraph,

    italic,
    bold,
    link,

    seg,
    concat,
    add,
    extractText,
    fold,
}
