
const fs = require('fs')

const data = fs.readFileSync(process.argv[2], 'utf-8')

const idx = process.argv[3]

const items = JSON.parse(data)
items.forEach((l) => {
    l[idx] = Number(String(l[idx]).replace(',', '.'))
}) 

console.log(JSON.stringify(items, null, 2))

