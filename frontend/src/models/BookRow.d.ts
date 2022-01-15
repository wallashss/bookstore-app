

export type BookRow = {
  id: number,
  publisherCode: string,
  name: string,
  bookId: number, 
  publisherName: string,
  currentPrice: number,
  status: 'P' | 'R' | 'A' | 'D' | 'C'
}