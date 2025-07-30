import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

async function exportToExcel(props) {
  const { filename, columns, dataSource } = props;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(filename);

  worksheet.columns = columns;

  worksheet.addRows(dataSource);

  worksheet.eachRow((col, index) => {
    if (index === 1) {
      col.font = { bold: true };
    }
    col.alignment = { wrapText: true };
  });

  const excelBuffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([excelBuffer]), `${filename}.xlsx`);
  workbook.removeWorksheet(filename);
}

export default exportToExcel;
