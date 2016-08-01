function printEntry(entry) {
    if (entry) {
        console.log(entry.seeAlso);
        for (var _i = 0, _a = entry.languages; _i < _a.length; _i++) {
            var language = _a[_i];
            console.group(language.header);
            console.log(language.content);
            console.groupEnd();
        }
    }
    else {
        console.warn("Not found");
    }
}
