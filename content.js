// var sectionize = (text) => {
//     // the tail you've met in Haskell
//     var tail = (list) => {
//         var result = [];
//         for (var i = 1; i < list.length; i++) {
//             result.push(list[i]);
//         }
//         return result;
//     }
//
//     var collectSections = (text, regexs) => {
//         if (regexs.length === 0) {
//             return {
//                 paragraph: text,
//                 sections: {}
//             }
//         } else {
//             var obj = {
//                 paragraph: "",
//                 sections: {}
//             };
//             var splitted = text.split(regexs[0]);
//             for (var [index, value] of splitted.entries()) {
//                 if (index === 0) {
//                     obj.paragraph = splitted[0];
//                 }
//                 if (index % 2 === 1) {
//                     obj.sections[value] = collectSections(splitted[index + 1], tail(regexs));
//                 }
//             }
//             return obj;
//         }
//     }
//
//     var h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
//     var h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
//     var h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;
//
//     return collectSections(text, [h2regex, h3regex, h4regex]);
// }
//
// var parseWiktionary = function(text) {
//     var sections = sectionize(text);
//
//     var germanSection = sections.sections.German;
//     // console.log(germanSection)
//     // return sections
//     return germanSection
// }
//
// var valid = true;
// var textSelectionListener = () => {
//     var word = window.getSelection().toString().trim();
//     if (word && valid) {
//         chrome.runtime.sendMessage({word: word});
//     }
// };
//
// // detect text selections
// window.addEventListener("beforeunload", () => {
//     document.removeEventListener("mouseup", textSelectionListener);
//     valid = false;
//     chrome.runtime.sendMessage({unbind: true});
// });
// document.addEventListener("mouseup", textSelectionListener, false);
//
//
//
// var printSections = (result) => {
//     if (typeof result === "string") {
//         console.log(result)
//     } else {
//
//         // print paragraph
//         if (result.paragraph) {
//             console.log(result.paragraph)
//         }
//
//         // print sub-sections
//         for (header in result.sections) {
//             console.group(header)
//             printSections(result.sections[header]);
//             console.groupEnd()
//         }
//     }
// }
//
// chrome.runtime.onMessage.addListener((reply) => {
//     // clear the old reply
//     console.clear();
//
//     if (reply.text) {
//         var result = parseWiktionary(reply.text);
//         console.log("https://en.wiktionary.org/wiki/" + reply.word);
//         printSections(result)
//     } else {
//         console.warn("Not found");
//     }
// })
