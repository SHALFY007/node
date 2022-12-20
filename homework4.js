import readline from "readline";
import colors from "colors";
import path from "path";
import inquirer  from "inquirer"
import fsp from"fs/promises";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const root = process.cwd();

const findFile = (dirName) => {
    return fsp
        .readdir(dirName)
        .then((choices) => {
            return inquirer.prompt([
                {
                name: 'fileName',
                type: 'list',
                message: 'Выбери файл',
                choices
            },
            {
              name: 'findString',
              type: 'input',
              message: 'Введите слова для поиска',
              async when({fileName}) {
                const fullPath = path.join(dirName, fileName)
                const stat = await fsp.stat(fullPath)

                return stat.isFile();
              },
            } 
            ]);
        })
        .then( async ({fileName, findString}) => {
            const fullPath = path.join(dirName, fileName);
            if (findString === undefined) return findFile(fullPath);

            return Promise.all([
                fsp.readFile(fullPath, "utf-8"),
                Promise.resolve(findString),
            ]);
        })
        .then((result) => {
            if (result) {
                const [text, findString] = result;
                const pattern = new RegExp(findString, "g");
                let count = 0;
                const out = text.replace(pattern, () => {
                    count++;
                    return colors.red(findString);
                });

                console.log(out, "\n", colors.green(`Found ${count} values`))
            }
        })
}

rl.question(
    `Выберите путь: `, (dirPath) => {
    const dirName = path.join(root, dirPath)

    findFile(dirName)
    }
)
