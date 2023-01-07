
const fs = require('fs')

const data = fs.readFileSync(process.argv[2], 'utf-8')

const value = Number(process.argv[3])

const items = JSON.parse(data)


console.log(items)
// console.log(JSON.stringify(items, null, 2))

