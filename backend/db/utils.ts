import { Knex, knex } from "knex"

import fs from 'fs'

export async function ingest(db : Knex, inputPath : string)
{

    const inputData = fs.readFileSync(inputPath, 'utf-8');
    
    const rows : any [] = JSON.parse(inputData)

    const MAX_BATCH_SIZE = 100;
    const batchCount = Math.ceil(rows.length / MAX_BATCH_SIZE)
    for (let i =0; i < batchCount; i++)
    {
        console.log('Batch #', i)
        const batch = rows.slice(i * MAX_BATCH_SIZE, Math.min(i * MAX_BATCH_SIZE + MAX_BATCH_SIZE, rows.length))
        const res = await db('book').insert(batch)
        console.log('ok')
        console.log(res)
    }
    
}