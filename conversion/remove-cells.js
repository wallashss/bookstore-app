
const fs = require('fs')

const data = fs.readFileSync(process.argv[2], 'utf-8')


const indices = process.argv.slice(3).map(i => Number(i))

const items = JSON.parse(data)

const toRemove = new Set(indices)

items.forEach((l, idx) => {
    items[idx] = l.filter((l, i) => !toRemove.has(i) )
}) 

console.log(JSON.stringify(items, null, 2))

