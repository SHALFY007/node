const colors = require('colors');

const args = process.argv.slice(2)

if(+args[0] <= 0 || +args[0] > 0 ) {
    for (let i = Number(args[0]); i <= Number(args[1]); i++) {
        switch (i%3) {
            case 0:
                console.log(colors.green(i))
                break;
            case 1:
                console.log(colors.yellow(i))
                break;
            case 2:
                console.log(colors.red(i))
                break;
            default:
                console.log(colors.red('ERROR!!'))
                break;
        }
    }
} else {
    console.log(colors.red('Вы ввели не число'))
}



console.log(colors.red(args));