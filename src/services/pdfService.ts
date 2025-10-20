import PDFDocument from 'pdfkit';
import { getFormDataForUser } from './formService';

const formatValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'string' && value.trim() === '') {
    return '-';
  }

  return String(value);
};

export const createFormPdf = async (userId: number): Promise<Buffer> => {
  const formData = await getFormDataForUser(userId);
  const document = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  return await new Promise<Buffer>((resolve, reject) => {
    document.on('data', (chunk) => {
      chunks.push(chunk);
    });

    document.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    document.on('error', (error) => {
      reject(error);
    });

    document.fontSize(18).text('Formulario de expedición de título', {
      align: 'center'
    });

    document.moveDown();

    document.fontSize(14).text('Datos Personales', { underline: true });
    document.moveDown(0.5);
    document.fontSize(12);
    document.text(`Apellido: ${formatValue(formData.person.lastName)}`);
    document.text(`Nombre: ${formatValue(formData.person.firstName)}`);
    document.text(`Documento: ${formatValue(formData.person.documentNumber)}`);
    document.text(`Fecha de nacimiento: ${formatValue(formData.person.birthDate)}`);
    document.text(`Nacionalidad: ${formatValue(formData.person.nationalityId)}`);
    document.text(`Ciudad de nacimiento: ${formatValue(formData.person.birthCityId)}`);

    document.moveDown();

    document.fontSize(14).text('Datos de Contacto', { underline: true });
    document.moveDown(0.5);
    document.fontSize(12);
    document.text(
      `Teléfono celular: ${formatValue(formData.contact?.mobilePhone ?? null)}`
    );
    document.text(`Correo electrónico: ${formatValue(formData.contact?.emailAddress ?? null)}`);

    document.moveDown();

    document.fontSize(14).text('Datos de Domicilio', { underline: true });
    document.moveDown(0.5);
    document.fontSize(12);
    const street = formData.address?.street ?? null;
    const streetNumber = formData.address?.streetNumber ?? null;
    const city = formData.address?.city?.cityName ?? null;
    const province = formData.address?.province?.provinceName ?? null;
    const country = formData.address?.country?.countryName ?? null;
    document.text(`Calle: ${formatValue(street)}`);
    document.text(`Número: ${formatValue(streetNumber)}`);
    document.text(`Ciudad: ${formatValue(city)}`);
    document.text(`Provincia: ${formatValue(province)}`);
    document.text(`País: ${formatValue(country)}`);

    document.moveDown();

    document.fontSize(14).text('Datos de Egresado', { underline: true });
    document.moveDown(0.5);
    document.fontSize(12);
    const graduateType = formData.graduate?.graduateType ?? null;
    const militaryRankId = formData.graduate?.militaryRankId ?? null;
    const forceId = formData.graduate?.forceId ?? null;
    document.text(`Tipo de egresado: ${formatValue(graduateType)}`);
    document.text(`ID de grado militar: ${formatValue(militaryRankId)}`);
    document.text(`ID de fuerza militar: ${formatValue(forceId)}`);

    document.moveDown(2);
    document.fontSize(10).text(`Generado el: ${new Date().toLocaleString('es-AR')}`);

    document.end();
  });
};
