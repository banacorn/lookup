import * as _ from 'lodash'
import { lookup, render } from '../actions';
import { fetch } from '../util';
import parse from './parser';
import operator from './operator';

operator.setListener((sendMessage: (msg: any) => void, word: string) => {
    sendMessage(lookup(word));
    fetch(word).then(
        result => sendMessage(render(parse(result)))
    )
});
