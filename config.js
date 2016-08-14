System.config({
    baseURL: chrome.extension.getURL("/"),
    defaultJSExtensions: true,
    map: {
        "lodash": "bower_components/lodash/index.js",
        "parsimmon": "bower_components/parsimmon/index.js",
        "util": "bower_components/util/util.min.js"
    },
    packages: {
        scripts: {
            format: "register",
            defaultExtension: "js"
        }
    }
});

System.import("js/content.js")
      .then(null, console.error.bind(console));
