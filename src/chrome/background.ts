import * as _ from 'lodash'
import { lookup } from '../actions';
import { fetch } from '../util';
import parse from './parser';
import operator from './operator';

operator.setListener((sendMessage: (msg: any) => void, word: string) => {
    sendMessage(lookup(word));
});
