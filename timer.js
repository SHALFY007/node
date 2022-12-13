const EventEmitter = require('events')

class TimerEmitter extends EventEmitter {}
const emitter = new TimerEmitter();

const getPrettyTime = (seconds) => {
    const values = [
        Math.floor(seconds%60),
        Math.floor((seconds /60) %60),
        Math.floor(seconds/ (60*60) % 24),
        Math.floor(seconds / (60*60*24)),

    ]
    return `${values.pop()} days, ${values.pop()} hours, ${values.pop()} minutes,  ${values.pop()} seconds`
}

emitter.on('timerTick', ([dateInFuture, timer]) => {
    const dateNow = new Date();

    if (!(dateNow <= dateInFuture)) {
        emitter.emit('timerEnd', timer)
    } else {
        console.log(getPrettyTime((dateInFuture- dateNow)/1000), 'left')
    }
})

emitter.on('timerEnd', (timer) => {
    console.log('Time is up!');
    clearInterval(timer)
})

const start = (dateInFuture) => {
    setInterval(function() {
        emitter.emit('timerTick', [dateInFuture, this])
    }, 1000)
    
}

const [hours, day, month, year] = process.argv[2].split('-');
const dateInFuture = new Date(year, month-1, day, hours);
start(dateInFuture);