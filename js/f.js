function printHeader(name) {
    console.group(name);
}
function printSection(section) {
    if (section.body.trim())
        console.log(section.body);
    for (var _i = 0, _a = section.subs; _i < _a.length; _i++) {
        var sub = _a[_i];
        printHeader(sub.header);
        printSection(sub);
        console.groupEnd();
    }
}
function printEntry(entry) {
    if (entry) {
        if (settings.displayAllLanguages) {
            printSection(entry);
        }
        else {
            var languageEntry = _.find(entry.subs, { header: settings.language });
            if (languageEntry) {
                printSection(languageEntry);
            }
            else {
                console.warn("No such entry for " + settings.language);
            }
        }
    }
    else {
        console.warn("Not found");
    }
}
