import { AST, Fmt, Seg } from "../type";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:audio
// {{audio|<name of sound file>|<text to use as link to soundfile>|lang=<language code>}}
function audio(word: string, named: AST.Parameter<Seg>[], unnamed: Fmt[]): Fmt {
    return [F.seg(`🔊`)];
}

export default audio;
