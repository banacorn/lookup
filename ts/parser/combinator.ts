import * as P from "parsimmon";
import { Parser } from "parsimmon";
import * as _ from "lodash";

function before(candidates: string[]): Parser<string> {
    return <Parser<string>>P.custom((success, failure) => {
        return (stream, i) => {
            const indices: {token: string, index: number}[] = candidates.map((candidate) => {
                return {
                    token: candidate,
                    index: stream.substr(i).indexOf(candidate)
                };
            }).filter((o) => o.index !== -1);

            const chosenIndex = _.minBy(indices, (o) => o.index);
            if (chosenIndex) {
                return success(i + chosenIndex.index, stream.substr(i, chosenIndex.index));
            } else {
                return failure(i, `'${candidates}' not found`);
            }
        }
    });
}


function beforeWhich(candidates: string[]): Parser<[string, string]> {
    return <Parser<[string, string]>>P.custom((success, failure) => {
        return (stream, i) => {
            const indices: {token: string, index: number}[] = candidates.map((candidate) => {
                return {
                    token: candidate,
                    index: stream.substr(i).indexOf(candidate)
                };
            }).filter((o) => o.index !== -1);

            const chosenIndex = _.minBy(indices, (o) => o.index);
            if (chosenIndex) {
                return success(i + chosenIndex.index, [stream.substr(i, chosenIndex.index), chosenIndex.token]);
            } else {
                return failure(i, `'${candidates}' not found`);
            }
        }
    });
}


function muchoPrim<T>(acc: T[], parsers: Parser<T>[], codaParser: Parser<any>, predicate: (x: T) => boolean) {
    // modify parsers to allow them to collect parsed result and then keep going
    const modifiedParsers = parsers.map((parser) => {
        return parser.chain((chunk) => {
            // if the predicate is satisfied, then keep going
            if (predicate(chunk)) {
                return muchoPrim(_.concat(acc, [chunk]), parsers, codaParser, predicate);

            // else return the results early
            } else {
                return codaParser.then(P.succeed(acc));
            }
        });
    });
    // insert EOF parser and returns accumulated results on success
    // modifiedParsers.unshift(codaParser.chain(() => {
    modifiedParsers.push(codaParser.chain(() => {
        return P.succeed(acc);
    }));
    // apply modify parsers to Parsimmon.alt
    return P.alt.apply(P.alt, modifiedParsers);
}

export {
    before, beforeWhich,
    muchoPrim
}
