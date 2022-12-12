const EventEmitter = require('events')

class TimerEmitter extends EventEmitter {}
const emitter = new TimerEmitter();

const dateNow = new Date();

emitter.on('timerTick', (dateInFuture, dateNow) => {

})

const start = (dateInFuture) => {
    setInterval(function() {
        emitter.emit('timerTick', [dateInFuture, this])
    }, 1000)
    
}

const [hours, day, month, year] = process.argv[2].split('-');

console.log(dateNow)
