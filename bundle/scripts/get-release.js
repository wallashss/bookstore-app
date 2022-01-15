'use strict';
const fs = require('fs')
const path = require('path')
const JSZip = require("jszip");
const AWS = require('aws-sdk')
// read a zip file

const basePath = 'app'


// Get release from S3
const s3 = new AWS.S3()
const Key = process.env.RELEASE_PATH_KEY
const Bucket = process.env.RELEASE_BUCKET
s3.getObject({
  Key,
  Bucket
})
.promise()
.then((data) => {
  return data.Body
})
.then((data)=> {
  // Extract archive
  fs.mkdirSync(basePath, {recursive: true})

  JSZip.loadAsync(data).then( (zip) => {
    
    zip.forEach((filePath, obj) => {

      const dir = path.dirname(filePath);
      fs.mkdirSync(path.join(basePath, dir), {recursive: true})

      if(!obj.dir) {
        const outPath = path.join(basePath, filePath)
        const filestream = fs.createWriteStream(outPath)
        obj.nodeStream()
          .pipe(filestream);
      }
    })
  });
})



