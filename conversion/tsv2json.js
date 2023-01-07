
const fs = require('fs')

const data = fs.readFileSync(process.argv[2], 'utf-8')

const table = data.split('\n')
    .map(l => l.trim())
    .filter(l => l)
    .map(l => l.split('\t'))

console.log(JSON.stringify(table, null, 2))