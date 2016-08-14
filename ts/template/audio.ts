import { AST, Fmt } from "../type";
import * as F from "../fmt";

// https://en.wiktionary.org/wiki/Template:audio
// {{audio|<name of sound file>|<text to use as link to soundfile>|lang=<language code>}}
function audio(word: string, raw: AST.Parameter[]): Fmt {
    return [F.seg(`🔊`)];
}

export default audio;
