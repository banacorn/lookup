function printEntry(entry: Entry) {
    if (entry) {
        console.log(entry.seeAlso);
        for (var language of entry.languages) {
            console.group(language.header);
            console.log(language.content);
            console.groupEnd();
        }
    } else {
        console.warn("Not found");
    }
}
