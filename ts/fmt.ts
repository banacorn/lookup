import * as _ from "lodash";
import { Fmt, AST, ParsedParagraph, Section, Seg } from "./type";
import { transclude } from "./template";

//
//  Formatter
//

function extractText(fmt: Fmt): string {
    return fmt.map(x => x.text).join("");
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

function fold(fmt: Fmt, elements: AST.Inline[], f?: (x: Fmt) => Fmt): Fmt {
    if (f) {
        elements.forEach((e) => {
            fmt = concat(fmt, f(formatElement(e)));
        });
    } else {
        elements.forEach((e) => {
            fmt = concat(fmt, formatElement(e));
        });
    }
    return fmt;
}

//
//  Formatting stuffs
//

function formatElement(element: AST.Inline): Fmt {
    switch (element.kind) {
        case "plain":
            let fmt = [];
            return add([], element.text);
        case "italic":
            return fold([], element.subs, italic);
        case "bold":
            return fold([], element.subs, bold);
        case "link":
            return fold([], element.subs, link);
        case "template":
            const transclusion = transclude("unknown entry", element);
            if (transclusion) {
                return transclusion;
            } else {
                fmt = add([], `{{${element.name}`);
                element.params.forEach((param) => {
                    if (param.name) {       // named
                        fmt = add(fmt, `|${param.name}=`);
                        fmt = fold(fmt, param.value);
                    } else {                // unnamed
                        fmt = add(fmt, `|`);
                        fmt = fold(fmt, param.value);
                    }
                });
                fmt = add(fmt, `}}`);
                return fmt
            }
    }
}


function formatLine(line: AST.Line, order: number): Fmt {
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

    const formattedElements: Fmt = fold([], line.line);
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


function formatParagraph(result: ParsedParagraph): Fmt {
    let order = [1];
    if (result.kind === "ok") {
        let fmt = [];
        result.value.forEach((line) => {
            fmt = concat(fmt, formatLine(line, _.last(order)));
            fmt = add(fmt, "\n");
            const numbered = line.oli > 0 && line.uli === 0 && line.indent === 0;
            const level = line.oli;
            if (level > order.length)   // indent
                order.push(1);
            else if (level < order.length) {
                order.pop();
            }
        });
        return fmt;
    } else {
        return add([], "failed to parse this paragraph\n");
    }
}

// function formatSection(section: Section<ParsedParagraph>): Section<Fmt> {
//     let fmt = [];
//
//     const formattedBody: Fmt[] = section.body.map((result) => {
//         if (result.kind === "ok") {
//             return formatParagraph(result.value);
//         } else {
//             return add([], "Paragraph parse error");
//         }
//     });
//     return {
//         header: section.header,
//         body: formattedBody,
//         subs: section.subs.map(formatSection),
//     };
// }
//

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

    seg,
    concat,
    add,
    extractText,
    fold,
}
