import { Knex, knex } from "knex"

import fs from 'fs'

const inputPath = process.argv[2]

const inputData = fs.readFileSync(inputPath, 'utf-8');


const data =  inputData.split('\n')
    .map(l => l.trim())
    .filter(l => l)
    .map(l => l.split('\t'))

const publisherId = process.argv[3]

const outfile = process.argv[4]


async function main() {

    const dbPath = process.env['DB_PATH'] || 'data/bookstore.db'
    console.log(dbPath)
    const db = knex(
      {
        client: 'sqlite3',
        connection: {
          filename: dbPath
        },
        useNullAsDefault: true
      }
    )
    
    const rows : any[] = data.map( (r: string[]) => {
        return {
            name: r[0].trim(),
            indexName: r[0].trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            price: Number(String(r[1]).replace(',', '.').replace(/[r\s\$]*/ig, '')),
            publisherId: Number(publisherId),
            publisherCode: r[2] ? String(r[2]).trim() : undefined
        }
    })

    fs.writeFileSync(outfile, JSON.stringify(rows, null, 2))



}

main()