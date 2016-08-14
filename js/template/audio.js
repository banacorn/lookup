System.register(["../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F;
    // https://en.wiktionary.org/wiki/Template:audio
    // {{audio|<name of sound file>|<text to use as link to soundfile>|lang=<language code>}}
    function audio(word, named, unnamed) {
        return [F.seg("\uD83D\uDD0A")];
    }
    return {
        setters:[
            function (F_1) {
                F = F_1;
            }],
        execute: function() {
            exports_1("default",audio);
        }
    }
});
