/**
 * Baby Shower de Damián — backend de confirmaciones.
 * Este código vive en Google Apps Script, pegado dentro de tu Google Sheet
 * (instrucciones paso a paso en README.md).
 *
 * - doPost: recibe cada confirmación del formulario y la agrega como fila.
 * - doGet:  devuelve el conteo {confirmaciones, personas} para el censo en vivo.
 */

const SHEET_NAME = 'Confirmaciones';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    const sh = hoja_();
    const p = (e && e.parameter) || {};
    const acomp = Math.max(0, Math.min(10, Number(p.acompanantes) || 0));
    sh.appendRow([
      new Date(),
      String(p.nombre || '').slice(0, 120),
      acomp,
      acomp + 1,
      String(p.actitud || '').slice(0, 60),
      String(p.telefono || '').slice(0, 30),
      String(p.mensaje || '').slice(0, 300),
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const sh = hoja_();
  let confirmaciones = 0, personas = 0;
  if (sh.getLastRow() > 1) {
    const filas = sh.getRange(2, 4, sh.getLastRow() - 1, 1).getValues(); // col D: total por grupo
    confirmaciones = filas.length;
    personas = filas.reduce(function (s, f) { return s + (Number(f[0]) || 0); }, 0);
  }
  return json_({ ok: true, confirmaciones: confirmaciones, personas: personas });
}

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    // Adopta la primera pestaña (la planilla ya viene con encabezados) y la renombra
    sh = ss.getSheets()[0];
    sh.setName(SHEET_NAME);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(['Fecha', 'Nombre', 'Acompañantes', 'Total personas', 'Declaración', 'Teléfono', 'Mensaje']);
  }
  if (sh.getFrozenRows() === 0) {
    sh.getRange('1:1').setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
