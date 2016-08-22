import * as _ from 'lodash'
import { jump, render } from '../actions';
import { fetch } from '../util';
import parse from './parser';
import operator from './operator';

operator.setListener((sendMessage: (msg: any) => void, word: string) => {
    sendMessage(jump(word));
    fetch(word).then(
        result => sendMessage(render(parse(result)))
    )
});
