import PDFDocumentPdfKit from 'pdfkit';
const PDFDocumentTable = require("pdfkit-table");
import { Writable } from 'stream';
import PendingBookRepository from '../repositories/PendingBookRepository';
import PublisherRepository from '../repositories/PublisherRepository';


const verticalMargin = 20;
const horizontalMargin = 30;

type PDFDocument = typeof PDFDocumentPdfKit & {
  table : (table: any, options: any) => void,
  addBackground : (...args: any[]) => void 
}

export default class PendingBooksPdfService {

  constructor(
    private readonly pendingBookRepo : PendingBookRepository,
    private readonly publisherRepo : PublisherRepository,
  ) {

  }

  async generatePendingPublisherPdf(publisherId : number, stream : Writable) {

    const address = process.env.STORE_ADDRESS
    const phone = process.env.STORE_PHONE
    
    // const books = await this.requestItemRepo.getRequestBooks(request.id)
    const books = await this.pendingBookRepo.getPendingFromPublisher(publisherId)

    const publisher = await this.publisherRepo.getPublisher(publisherId)
  

    const doc : PDFDocument = (new PDFDocumentTable({
      margins: {
        left: horizontalMargin, 
        right: horizontalMargin, 
        top: verticalMargin, 
        bottom: verticalMargin
      }
    }));

    doc.pipe(stream)

    // Header
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
    doc.text('Santos Variedades', 
      {align: 'center'})
    doc.text('Livraria e Papelaria', 
      {align: 'center'})

    // Sub Header
    doc
      .font('Helvetica')
      .fontSize(12)

    doc.moveDown()
    doc.text(address, 
      {align: 'center'})
    doc.text(`Fone: ${phone}`, 
      {align: 'center'})

    doc.moveDown()

    // Title

    doc
      .font('Helvetica-Bold')
      .fontSize(18)
    doc.text('Pedido de Livros', 
      {align: 'center'})

    // Info 
    doc
      .font('Helvetica')
      .fontSize(12)

    doc.text(`Data: ${new Date().toLocaleDateString()}`)
    doc.text(`Editora: ${publisher.name || "--"}`)

    doc.moveDown()
    // Books Table

    
    
    console.log(books)
    const rows = books.map((b, idx) => [
      idx + 1,
      b.publisherCode || '--',
      b.name,
      b.count,
      b.sum.toFixed(2)
    ])

    const booksSum = books.reduce((sum : number, b : any) => sum + b.sum , 0) || 0

 
    rows.push([
      '',
      '',
      'TOTAL',
      '',
      booksSum.toFixed(2)
    ])

    const table = {
      headers: [
        { label:"#", property: 'idx', width: 30 },
        { label:"Codigo", property: 'idx', width: 90 },
        { label:"Título", property: 'name', width: 283}, 
        { label:"QTDE", property: 'publisher', width: 40, align: 'center'}, 
        { label:"Valor (R$)", property: 'price', width: 90, align: 'center'}, 
      ],
      rows,
    };

    doc.table(table, {
      prepareHeader: () => {
        doc.font("Helvetica").fontSize(12)
      },
      prepareRow: (row : any, indexColumn : number, indexRow : any, rectRow: any) => {
        if(indexRow === rows.length - 1) {
          doc.font("Helvetica-Bold")
            .fontSize(10);
        }
        else {
          doc.font("Helvetica").fontSize(10);
        }
      },
    })
    
    doc.end()

  }
}