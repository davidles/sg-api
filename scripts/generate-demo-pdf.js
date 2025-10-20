const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.resolve(process.cwd(), 'demo.pdf');

const doc = new PDFDocument({ margin: 50 });
const writeStream = fs.createWriteStream(outputPath);

doc.pipe(writeStream);

doc
  .fontSize(20)
  .text('Demo Requirement Document', { align: 'center' })
  .moveDown();

doc.fontSize(12).text('Este archivo PDF se generó para probar la carga de requisitos en el CU_10.');
doc.moveDown();
doc.text(`Generado el: ${new Date().toLocaleString('es-AR')}`);

doc.end();

writeStream.on('finish', () => {
  console.log(`PDF generado en: ${outputPath}`);
});
