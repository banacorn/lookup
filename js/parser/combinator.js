System.register(["parsimmon", "lodash"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var P, _;
    // import "colors";
    // import { inspect } from "util";
    function before(candidates) {
        return P.custom(function (success, failure) {
            return function (stream, i) {
                var indices = candidates.map(function (candidate) {
                    return {
                        token: candidate,
                        index: stream.substr(i).indexOf(candidate)
                    };
                }).filter(function (o) { return o.index !== -1; });
                var chosenIndex = _.minBy(indices, function (o) { return o.index; });
                if (chosenIndex) {
                    return success(i + chosenIndex.index, stream.substr(i, chosenIndex.index));
                }
                else {
                    return failure(i, "'" + candidates + "' not found");
                }
            };
        });
    }
    function beforeWhich(candidates) {
        return P.custom(function (success, failure) {
            return function (stream, i) {
                var indices = candidates.map(function (candidate) {
                    return {
                        token: candidate,
                        index: stream.substr(i).indexOf(candidate)
                    };
                }).filter(function (o) { return o.index !== -1; });
                var chosenIndex = _.minBy(indices, function (o) { return o.index; });
                if (chosenIndex) {
                    return success(i + chosenIndex.index, [stream.substr(i, chosenIndex.index), chosenIndex.token]);
                }
                else {
                    return failure(i, "'" + candidates + "' not found");
                }
            };
        });
    }
    function muchoPrim(acc, parsers, codaParser, predicate) {
        // modify parsers to allow them to collect parsed result and then keep going
        var modifiedParsers = parsers.map(function (parser) {
            return parser.chain(function (chunk) {
                // if the predicate is satisfied, then keep going
                if (predicate(chunk)) {
                    return muchoPrim(_.concat(acc, [chunk]), parsers, codaParser, predicate);
                }
                else {
                    return codaParser.then(P.succeed(acc));
                }
            });
        });
        // insert EOF parser and returns accumulated results on success
        // modifiedParsers.unshift(codaParser.chain(() => { // shallow
        modifiedParsers.push(codaParser.chain(function () {
            return P.succeed(acc);
        }));
        // apply modify parsers to Parsimmon.alt
        return P.alt.apply(P.alt, modifiedParsers);
    }
    return {
        setters:[
            function (P_1) {
                P = P_1;
            },
            function (_1) {
                _ = _1;
            }],
        execute: function() {
            exports_1("before", before);
            exports_1("beforeWhich", beforeWhich);
            exports_1("muchoPrim", muchoPrim);
        }
    }
});
