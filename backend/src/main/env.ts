

export default {

  host: process.env.HTTP_HOST || "0.0.0.0",
  port: Number(process.env.HTTP_PORT) || 5000,
  db: {
    filename: 'data/bookstore.db'
  },
  page: {
    bucket: process.env.PAGE_BUCKET,
    key: process.env.PAGE_KEY,
  }

}