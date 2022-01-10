
import RequestItemRepository from '../repositories/RequestItemRepository';
import RequestRepository from '../repositories/RequestRepository'

import PDFDocumentPdfKit from 'pdfkit';
const PDFDocumentTable = require("pdfkit-table");
import { Writable } from 'stream';


const verticalMargin = 20;
const horizontalMargin = 30;

type PDFDocument = typeof PDFDocumentPdfKit & {
  table : (table: any, options: any) => void,
  addBackground : (...args: any[]) => void 
}

export default class RequestPdfService {

  constructor(
    private readonly requestRepository : RequestRepository,
    private readonly requestItemRepo : RequestItemRepository,
  ) {

  }

  async generateRequestPdf(requestId : number, stream : Writable) {

    const address = process.env.STORE_ADDRESS
    const phone = process.env.STORE_PHONE
    const request = await this.requestRepository.getRequest(requestId);

    const books = await this.requestItemRepo.getRequestBooks(request.id)

    // const doc = new pdfkit()

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

    doc.text(`Nº do pedido: ${request.id}`)
    doc.text(`Data: ${new Date(request.requestDate).toLocaleDateString()}`)
    doc.text(`Atendente: ${request.sellerName || "--"}`)
    doc.text(`Cliente: ${request.client || "--"}`)
    doc.text(`Telefone ${request.clientPhone || "--"}`)

    doc.moveDown()
    // Books Table

    
    
    const rows = books.map((b, idx) => [
      idx + 1,
      b.name,
      b.publisherName,
      b.currentPrice.toFixed(2)
    ])

    const booksSum = books.reduce((sum : number, b : any) => sum + b.currentPrice , 0) || 0

    if(request.wrapPrice) {
      rows.push([
        '',
        'Encapamento',
        '',
        request.wrapPrice.toFixed(2)
      ])
    }
    if(request.discount) {
      rows.push([
        '',
        'Desconto',
        '',
        `-${request.discount.toFixed(2)}`
      ])  
    }
    rows.push([
      '',
      'TOTAL',
      '',
      (booksSum + (Number(request.wrapPrice) ?? 0) - (request.discount ?? 0 )).toFixed(2)
    ])

    const table = {
      headers: [
        { label:"#", property: 'idx', width: 30 },
        { label:"Título", property: 'name', width: 323}, 
        { label:"Editora", property: 'publisher', width: 80}, 
        { label:"Valor (R$)", property: 'price', width: 100, align: 'center'}, 
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

    // Footer

    doc.fontSize(10)
    doc.text("Pedidos de livros prazo de entrega em até 90 dias" +
    "para livros que estiverem em falta na editora, após este prazo" +
    "o cliente pode ser reembolsado ou ressacido em espécie ou em " + 
    "mercadoria.")
    
    doc.end()

  }
}