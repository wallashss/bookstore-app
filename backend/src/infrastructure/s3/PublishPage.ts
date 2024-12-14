import ServerInfoService from "services/ServerInfoService"
import { S3 } from "@aws-sdk/client-s3";

export default async function publishPage(
  bucket: string,
  key: string,
  port: number,
  serverInfoService : ServerInfoService
  ) {

  try {

    const ip = serverInfoService.getIp()
    
    const s3 = new S3()
    const page = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Redirecting</title>
      </head>
      
      <script>
        window.location.href='http://${ip}:${port}'
      </script>
      </body>
    </html>
    `
    s3.putObject({
      Bucket: bucket, Key: key, 
      Body: page
    })
    .then(() => {
      console.log("Published page")
    })
    .catch(err => {
      console.log(err)
    })
  }
  catch(err) {
    console.log("Could not publish page")
  }
}

