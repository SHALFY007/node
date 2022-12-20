const {Transform} = require('stream')
const {createReadStream, createWriteStream} = require('fs');
const readline = require('readline');

const rs = createReadStream('./access_tmp.log.txt');
const ws = createWriteStream('%ip-адрес%_requests.log.txt')

const rl = readline.createInterface(rs);

rl.on('line', (a) => {
    const editedChunk = a.toString().match(/^89.123.1.41/g)
    if (a.toString().match(/^89.123.1.41 | ^34.48.240.111/g)  !== null) {
        ws.write(a)
    }

})