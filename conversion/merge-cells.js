

const fs = require('fs')

const data = fs.readFileSync(process.argv[2], 'utf-8')

const key = process.argv[3]

const indices = process.argv.slice(3).map(i => Number(i))

const items = JSON.parse(data)

const toMerge = items.map(i => indices.map(i2 => i[i2]).join(' '))

const toRemove = new Set(indices.slice(1))

items.forEach((l, idx) => {
    l[key] = toMerge[idx]

    items[idx] = l.filter((l, i) => !toRemove.has(i) )
}) 


console.log(JSON.stringify(items, null, 2))

