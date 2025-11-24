import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getFormDataForUser } from './formService';
const PAGE_WIDTH = 595; // A4 width in points
const PAGE_HEIGHT = 842; // A4 height in points
const MARGIN_X = 60;
const MARGIN_Y = 60;
const DEFAULT_LINE_HEIGHT = 12;
const DOTTED_SEGMENT_WIDTH = 3;
const DOTTED_SEGMENT_GAP = 3;
const SIGNATURE_BLOCK_WIDTH = 200;
const SIGNATURE_LINE_PATTERN_WIDTH = 4;
const SIGNATURE_LINE_PATTERN_GAP = 3;
const HYPHEN_SEPARATOR_FONT_SIZE = 9;

const drawDottedLine = (
  page: import('pdf-lib').PDFPage,
  startX: number,
  endX: number,
  y: number,
  segmentWidth = DOTTED_SEGMENT_WIDTH,
  gap = DOTTED_SEGMENT_GAP
) => {
  for (let x = startX; x < endX; x += segmentWidth + gap) {
    const effectiveEndX = Math.min(x + segmentWidth, endX);
    page.drawLine({
      start: { x, y },
      end: { x: effectiveEndX, y },
      thickness: 0.6,
      color: rgb(0.4, 0.4, 0.4)
    });
  }
};

const drawSignatureBlock = (
  page: import('pdf-lib').PDFPage,
  {
    x,
    width,
    label,
    name,
    font,
    boldFont,
    lineY,
    nameY,
    labelY
  }: {
    x: number;
    width: number;
    label: string;
    name: string;
    font: import('pdf-lib').PDFFont;
    boldFont: import('pdf-lib').PDFFont;
    lineY: number;
    nameY: number;
    labelY: number;
  }
) => {
  const nameWidth = font.widthOfTextAtSize(name, 11);
  const labelWidth = font.widthOfTextAtSize(label, 8);
  const centerX = x + width / 2;

  drawDottedLine(page, x, x + width, lineY, SIGNATURE_LINE_PATTERN_WIDTH, SIGNATURE_LINE_PATTERN_GAP);

  page.drawText(name, {
    x: centerX - nameWidth / 2,
    y: nameY,
    size: 11,
    font,
    color: rgb(0, 0, 0)
  });

  page.drawText(label, {
    x: centerX - labelWidth / 2,
    y: labelY,
    size: 8,
    font,
    color: rgb(0.2, 0.2, 0.2)
  });
};

const drawHyphenSeparator = (
  page: import('pdf-lib').PDFPage,
  font: import('pdf-lib').PDFFont,
  y: number
) => {
  const usableWidth = PAGE_WIDTH - MARGIN_X * 2;
  const hyphenWidth = font.widthOfTextAtSize('-', HYPHEN_SEPARATOR_FONT_SIZE);
  const hyphenCount = Math.ceil(usableWidth / hyphenWidth) + 2;
  const hyphenLine = '-'.repeat(hyphenCount);

  page.drawText(hyphenLine, {
    x: MARGIN_X,
    y,
    size: HYPHEN_SEPARATOR_FONT_SIZE,
    font,
    color: rgb(0.45, 0.45, 0.45)
  });
};

export const createFormPdf = async (userId: number): Promise<Buffer> => {
  const formData = await getFormDataForUser(userId);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fullName = [formData.person.lastName, formData.person.firstName]
    .map((value) => value?.trim() ?? '')
    .filter(Boolean)
    .join(' ');

  const nameToRender = fullName.length ? fullName : '---';
  const uppercaseName = nameToRender === '---' ? '---' : nameToRender.toUpperCase();

  // Header block
  const headerTitleY = PAGE_HEIGHT - 100;
  const headerText = 'Por Dios, la Patria y el Honor';
  const headerTextSize = 10;
  const headerTextWidth = helveticaBoldFont.widthOfTextAtSize(headerText, headerTextSize);

  page.drawText(headerText, {
    x: (PAGE_WIDTH - headerTextWidth) / 2,
    y: headerTitleY,
    size: headerTextSize,
    font: helveticaBoldFont,
    color: rgb(0, 0, 0)
  });

  const signatureBlockX = PAGE_WIDTH - MARGIN_X - SIGNATURE_BLOCK_WIDTH;
  const upperSignatureLineY = headerTitleY - 90;
  const upperSignatureNameY = upperSignatureLineY - 18;
  const upperSignatureLabelY = upperSignatureNameY - 12;

  drawSignatureBlock(page, {
    x: signatureBlockX,
    width: SIGNATURE_BLOCK_WIDTH,
    label: 'Firma y aclaración del solicitante',
    name: uppercaseName,
    font: helveticaFont,
    boldFont: helveticaBoldFont,
    lineY: upperSignatureLineY,
    nameY: upperSignatureNameY,
    labelY: upperSignatureLabelY
  });

  const hyphenSeparatorY = upperSignatureLabelY - 22;
  drawHyphenSeparator(page, helveticaFont, hyphenSeparatorY);

  // Informative paragraph
  const paragraphTop = hyphenSeparatorY - 40;
  const paragraphX = MARGIN_X;

  const legalParagraph =
    'Me notifico que, al momento de concluir el presente trámite, mis datos como graduado serán incluidos y publicados en el REGISTRO PÚBLICO DE GRADUADOS UNIVERSITARIOS (RM 3723/17).';

  page.drawText(legalParagraph, {
    x: paragraphX,
    y: paragraphTop - 18,
    size: 10,
    font: helveticaFont,
    color: rgb(0, 0, 0),
    maxWidth: PAGE_WIDTH - paragraphX - MARGIN_X,
    lineHeight: 14
  });

  // Lower signature block
  const paragraphBaselineY = paragraphTop - 18;
  const lowerSignatureLineY = paragraphBaselineY - 90;
  const lowerSignatureNameY = lowerSignatureLineY - 18;
  const lowerSignatureLabelY = lowerSignatureNameY - 12;

  drawSignatureBlock(page, {
    x: signatureBlockX,
    width: SIGNATURE_BLOCK_WIDTH,
    label: 'Firma y aclaración del solicitante',
    name: uppercaseName,
    font: helveticaFont,
    boldFont: helveticaBoldFont,
    lineY: lowerSignatureLineY,
    nameY: lowerSignatureNameY,
    labelY: lowerSignatureLabelY
  });

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
};
