require('dotenv/config');
const mysql = require('mysql2/promise');
const fs = require('fs');

const tablesToDescribe = [
  'titulo',
  'tituloEstado',
  'solicitud',
  'solicitud_tipo',
  'tipoSolicitudRequisito',
  'egresado',
  'persona',
  'planEstudio',
  'usuario',
  'requestrequirementinstance',
  'requeststatus',
  'requeststatushistory',
  'requirementinstancestatus'
];


(async () => {
  const outputLines = [];
  const logLine = (line = '') => {
    console.log(line);
    outputLines.push(line);
  };

  const dbName = process.env.DB_NAME;
  logLine(`Schema: ${dbName}`);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: dbName
  });

  const [tables] = await conn.query(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name',
    [dbName]
  );

  logLine(`Tables found: ${tables.length}`);
  if (tables.length > 0) {
    logLine(tables.map((table) => table.table_name).join('\n'));
  }

  const printRows = (label, rows) => {
    if (rows.length === 0) {
      logLine(`${label}: []`);
      return;
    }

    const header = Object.keys(rows[0]);
    logLine(`${label}:`);
    logLine(header.join('|'));
    rows.forEach((row) => {
      logLine(header.map((key) => String(row[key] ?? '')).join('|'));
    });
  };

  printRows('Tables detail', tables);

  for (const tableName of tablesToDescribe) {
    const [columns] = await conn.query(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT
         FROM information_schema.columns
        WHERE table_schema = ? AND table_name = ?
        ORDER BY ORDINAL_POSITION`,
      [dbName, tableName]
    );

    if (columns.length === 0) {
      logLine(``);
      logLine(`Columns for ${tableName}: (table not found)`);
      continue;
    }

    logLine('');
    printRows(`Columns for ${tableName}`, columns);
  }

  await conn.end();
  fs.writeFileSync('schema-inspect.txt', `${outputLines.join('\n')}\n`);
})();