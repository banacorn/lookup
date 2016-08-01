const h2regex = /(?:\s\s\-\-\-\-\s\s)?\=\=([^\=]+)\=\=\s/g;
const h3regex = /\=\=\=([^\=]+)\=\=\=\s/g;
const h4regex = /\=\=\=\=([^\=]+)\=\=\=\=\s/g;

function parseSection(header: string, text: RawText): Section {
    function collectSections(header: string, text: RawText, regexs: RegExp[]): Section {
        if (regexs.length === 0) {
            return {
                header: header,
                body: text,
                subs: []
            };
        } else {
            let result = {
                header: header,
                body: text,
                subs: []
            };
            let splittedChunks = text.split(regexs[0]);
            let index = 0;
            for (let chunk of splittedChunks) {
                if (index === 0) {
                    result.body = chunk;
                }
                if (index % 2 === 1) {
                    result.subs.push(collectSections(chunk, splittedChunks[index + 1], _.tail(regexs)));
                }
                index++;
            }
            return result;
        }
    }
    return collectSections(header, text, [h2regex, h3regex, h4regex]);
}


// function parseLanguageSection(section: Section): LanguageSection {
//
//     const result = parseSection(section.header, section.body);
//
//     return {
//         lang: section.header,
//         subs: []
//     }

    // const sections = split(section.body, h3regex);
    //
    // // find all header starts with "Etymology" (for there may be plenty of them)
    // const etymologies = sections.sections.filter((obj) => _.startsWith(obj.header, "Etymology"));
    //
    // // find all POS headers
    // // https://en.wiktionary.org/wiki/Wiktionary:Entry_layout#Part_of_speech
    // const posHeaders = sections.sections.filter((obj) => {
    //     return _.includes([
    //         // Parts of speech:
    //         "Adjective", "Adverb", "Ambiposition", "Article", "Circumposition",
    //         "Classifier", "Conjunction", "Contraction", "Counter", "Determiner",
    //         "Interjection", "Noun", "Numeral", "Participle", "Particle",
    //         "Postposition", "Preposition", "Pronoun", "Proper noun", "Verb",
    //         // Morphemes:
    //         "Circumfix", "Combining form", "Infix", "Interfix", "Prefix",
    //         "Root", "Suffix",
    //         // Symbols and characters:
    //         "Diacritical mark", "Letter", "Ligature", "Number",
    //         "Punctuation mark", "Syllable", "Symbol",
    //         // Phrases
    //         "Phrase", "Proverb", "Prepositional phrase",
    //         // Han characters and language-specific varieties:
    //         "Han character", "Hanzi", "Kanji", "Hanja",
    //         // Lojban-specific parts of speech
    //         "Brivla", "Cmavo", "Gismu", "Lujvo", "Rafsi",
    //         // Romanization
    //         "Romanization"
    //     ], obj.header);
    //
    // });
    // return {
    //     language:           section.header,
    //     subs: []
    //     // alternativeForms:   _.find(sections.sections, { header: "Alternative forms" }),
    //     // etymology:          etymologies,
    //     // pronunciation:      _.find(sections.sections, { header: "Pronunciation" }),
    //     // homophones:         _.find(sections.sections, { header: "Homophones" }),
    //     // rhymes:             _.find(sections.sections, { header: "Rhymes" }),
    //     // partOfSpeech:       posHeaders,
    //     // derivedTerms:       _.find(sections.sections, { header: "Derived terms" }),
    //     // relatedTerms:       _.find(sections.sections, { header: "Related terms" }),
    //     // descendants:        _.find(sections.sections, { header: "Descendants" }),
    //     // translations:       _.find(sections.sections, { header: "Translations" }),
    //     // seeAlso:            _.find(sections.sections, { header: "See also" }),
    //     // references:         _.find(sections.sections, { header: "References" }),
    //     // externalLinks:      _.find(sections.sections, { header: "External links" })
    // }

// }

function split(text: RawText, regex: RegExp): {
    paragraph: string,
    sections: Section[]
} {
    const splitted = text.split(regex);
    let result = {
        paragraph: "",
        sections: []
    }
    let index = 0;  // for enumeration
    for (var header of splitted) {
        if (index === 0) {
            result.paragraph = splitted[0];
        }
        if (index % 2 === 1) {
            result.sections.push({
                header: header,
                body: splitted[index + 1]
            });
        }
        index++;
    }
    return result;
}

function parseEntry(response: RawResponse): Entry {
    return parseSection(response.word, response.text)
    // const result = split(response.text, h2regex);
    // return {
    //     word: response.word,
    //     seeAlso: result.paragraph,
    //     languages: result.sections.map((section) => parseSection(section.header, section.body))
    //     // languages: result.sections.map((section) => {
    //     //     const {subs} = parseSection(section.header, section.body);
    //     //     return {
    //     //         lang: section.header,
    //     //         subs: subs
    //     //     }
    //     // })
    // }
}
