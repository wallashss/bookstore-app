
export enum RequestItemStatus {
  Pending='P',
  Requested='R',
  Arrived='A' ,
  Delivered='D',
  Cancelled='C',
} 

export default interface RequestItem {
  id: number
  bookId: number
  requestId: number
  currentPrice: number
  status: RequestItemStatus
}