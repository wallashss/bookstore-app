
import * as AWS from 'aws-sdk'
import path from 'path'
import fs from 'fs'

const Bucket = process.env.BACKUP_DB_BUCKET
const Path = process.env.BACKUP_DB_KEY
const dbPath = process.env.DB_PATH

const s3 = new AWS.S3()

const db = fs.readFileSync(dbPath)

const date = new Date()

const day = `${date.getFullYear()}-${ ('00' +(date.getMonth()+1)).slice(-2) }-${ ('00' + date.getDate()).slice(-2)}`
const timestamp = date.toISOString().replace(/[\:\-\.z]/ig, '');


s3.putObject({
  Bucket, Key: Path + "/" + day + "/" + timestamp + '.db', 
  Body: db
}).promise()
.then(() => {
  console.log("Backup Done")
})
.catch(err => {
  console.log(err)
})
