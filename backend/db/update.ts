import * as AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'

const UPDATE_BUCKET = process.env.UPDATE_DB_BUCKET
const UPDATE_PATH = process.env.UPDATE_DB_KEY
const dbPath = process.env.DB_PATH

const s3 = new AWS.S3()


async function main() {
    
    const list = await s3.listObjects({Bucket: UPDATE_BUCKET, Prefix: UPDATE_PATH}).promise()

    const updateFiles = list.Contents.map(f => f.Key).filter(f => f != UPDATE_PATH)
    console.log(updateFiles)

    const ingestionsFiles = fs.readdirSync('db/ingestions')
    console.log(ingestionsFiles)

    const ingestionSet = new Set(ingestionsFiles)

    let filesToGet = []
    for (let i of updateFiles)
    {
        if(!ingestionSet.has(path.basename(i)))
        {
            filesToGet.push(i)
        }
    }

    console.log(filesToGet)
    for (let f of filesToGet)
    {
        console.log("Dowloading ", f)
        const file = await s3.getObject({Bucket: UPDATE_BUCKET, Key: f}).promise()
        
        fs.writeFileSync(path.join('db/ingestions', path.basename(f)), file.Body.toString()); 
    }
}

main()