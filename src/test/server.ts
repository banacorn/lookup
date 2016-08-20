var restify = require('restify');
import { search, debug } from './util'

const respond = (req: any, res: any, next: any) => {
    search(req.params.word, (reply) => {
        res.send(reply);
    })
    next();
}

const cors = (req: any, res: any, next: any) => {
    res.header('content-type', 'text/plain');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
}

const server = restify.createServer();
server.use(cors);
server.get('/search/:word', respond);
server.head('/search/:word', respond);

server.listen(4000, () => {
    console.log(`${server.name} listening at ${server.url}`);
});
