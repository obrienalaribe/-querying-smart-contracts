const fs = require('fs');

function writeToFile(accountSet, path) {
    let accountArray = Array.from(accountSet)
    fs.writeFileSync(path, JSON.stringify(accountArray));
}

function readSetFromFile(path) {
    const fileContent = fs.readFileSync(path);
    const array = JSON.parse(fileContent);
    return new Set(array);
}

// const set = new Set()
// set.add(1).add(2).array 
// // write(set, './test.txt');
// const sets = readSetFromFile('./test.txt');
// console.log(sets);

module.exports = { writeToFile, readSetFromFile }