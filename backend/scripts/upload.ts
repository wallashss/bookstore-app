import { Knex, knex } from "knex"

import fs from 'fs'

const data = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'))

const publisherId = process.argv[3]

const apply = process.argv[4]


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


    console.log(rows)
    rows.forEach((r: any, idx: number) => {

        if(!r.price || Number.isNaN(r.price))
        {
            throw new Error(`Invalid row (${JSON.stringify(r)}) at ${idx}`)
        }
        
    });

    if(!apply)
    {
        console.log(rows.slice(0, 5))
        console.log('DRY RUN')
    }

    const MAX_BATCH_SIZE = 100;
    const batchCount = Math.ceil(rows.length / MAX_BATCH_SIZE)
    console.log('ROWS', rows.length)
    console.log('Batches', batchCount)
    if(apply)
    {
        for (let i =0; i < batchCount; i++)
        {
            console.log('Batch #', i)
            const batch = rows.slice(i * MAX_BATCH_SIZE, Math.min(i * MAX_BATCH_SIZE + MAX_BATCH_SIZE, rows.length))
            const res = await db('book').insert(batch)
            console.log('ok')
            console.log(res)
        }
        process.exit(0)
    }

}

main()