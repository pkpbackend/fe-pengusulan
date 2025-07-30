import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

import { v3ApiNew } from "@api/ApiCallV3New";
import { store } from "@store/store";
import {
  dataLahanFields,
  dataUmumFields,
  dataLainFields,
} from "../../vertek/VertekModal";
import sweetalert from "@src/utility/sweetalert";

const colorGreen = [67, 160, 71];
const colorOrange = [245, 127, 23];
const colorRed = [244, 67, 54];
const colorYellow = [255, 193, 7];
const fontSizeH1 = 12;

function getPersonilVertekData(data, personil) {
  return [
    {
      judul: "Nama",
      detail: data && data[`nama${personil}`] ? data[`nama${personil}`] : "",
    },
    {
      judul: "Jabatan",
      detail:
        data && data[`jabatan${personil}`] ? data[`jabatan${personil}`] : "",
    },
    {
      judul: "NIP",
      detail: data && data[`nip${personil}`] ? data[`nip${personil}`] : "",
    },
    {
      judul: "Telepon",
      detail:
        data && data[`telpon${personil}`] ? data[`telpon${personil}`] : "",
    },
  ];
}
const verminDocumentsTableConfig = (documents, currentPosition) => {
  return {
    columns: [
      { title: "#", dataKey: "#" },
      { title: "Dokumen", dataKey: "dokumen" },
      { title: "Status", dataKey: "status" },
      { title: "Komentar", dataKey: "keterangan" },
    ],
    body: documents.map((document, index) => ({
      "#": index + 1,
      dokumen: document.isRequired ? `${document.nama} *` : document.nama,
      status: renderStatusVerminText(
        document.verminDocument ? document.verminDocument?.lengkap : null
      ),
      keterangan: document.verminDocument
        ? document.verminDocument.keterangan || ""
        : "",
    })),
    theme: "grid",
    startY: currentPosition,
    headStyles: {
      fillColor: false,
      halign: "center",
      valign: "middle",
      lineColor: 200,
      lineWidth: 1,
      textColor: 20,
    },
    styles: { overflow: "linebreak", cellPadding: 4 },
    columnStyles: {
      "#": { cellWidth: "wrap" },
      status: { cellWidth: "wrap" },
      dokumen: { cellWidth: 150 },
    },
    didParseCell(cell, data) {
      if (cell.raw === "Verifikasi") {
        // cell.styles.fontSize= 10;
        cell.styles.textColor = colorYellow;
      } else if (cell.raw === "Sudah Verifikasi") {
        // cell.styles.fontSize= 10;
        cell.styles.textColor = colorGreen;
      } else if (cell.raw === "Tidak Sesuai") {
        // cell.styles.fontSize= 10;
        cell.styles.textColor = colorOrange;
      } else if (cell.raw === "Tidak Ada") {
        cell.styles.textColor = colorRed;
      }
    },
  };
};
const getCenterOffsetPDF = (doc, text) => {
  return (
    doc.internal.pageSize.getWidth() / 2 -
    (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / 2
  );
};
const renderStatusVerminText = function (statusVermin) {
  if (Number(statusVermin) === 1) {
    return "Sudah Verifikasi";
  } else if (Number(statusVermin) === 0 && statusVermin !== null) {
    return "Tidak Sesuai";
  }
  return "Belum di Verifikasi";
};

async function downloadPdfRusus({
  return64 = false,
  usulan,
  documents,
  locations = [],
  isAdmin = false,
}) {
  try {
    const fontSizeTitle = 20;
    const fontSizeSubTitle = 16;
    let doc = new jsPDF("p", "pt", "a4");
    let curPosY = 44;

    // HEADER
    doc.setFontSize(fontSizeTitle);
    doc.setTextColor(40);
    doc.setFont(undefined, "normal");

    // Title
    let title = `Usulan Kabupaten ${usulan.City ? usulan.City.nama : ""}`;
    doc.text(getCenterOffsetPDF(doc, title), 32, title);
    curPosY += 12;

    // subtitle
    doc.setFontSize(fontSizeSubTitle);
    doc.setTextColor(40);
    let text = `Nomor Usulan ${usulan.noUsulan}`;
    doc.text(getCenterOffsetPDF(doc, text), curPosY, text);
    curPosY += 32;

    // H1
    doc.text(40, curPosY, "Informasi");
    curPosY += 12;

    const rowsInformasi = [
      {
        judul: "No. Usulan",
        detail: usulan.noUsulan,
      },
      {
        judul: "No. Surat Permohonan",
        detail: usulan.noSurat || "",
      },
      {
        judul: "Tgl. Surat Permohonan",
        detail: usulan.tglSurat
          ? moment(usulan.tglSurat).format("DD-MM-YYYY")
          : "-",
      },
      {
        judul: "Kabupaten/Kota",
        detail: usulan.City ? usulan.City.nama.toUpperCase() : "",
      },
      {
        judul: "Provinsi",
        detail: usulan.Provinsi ? usulan.Provinsi.nama.toUpperCase() : "",
      },
      {
        judul: "Penerima Manfaat",
        detail: usulan.PenerimaManfaat ? usulan.PenerimaManfaat.tipe : "",
      },
      {
        judul: "Jumlah Unit",
        detail: usulan.jumlahUnit || "",
      },
      {
        judul: "NIK PIC Pengusul",
        detail: usulan.nik,
      },
      {
        judul: "Nama PIC Pengusul",
        detail: usulan.picPengusul,
      },
      {
        judul: "Jabatan PIC",
        detail: usulan.instansi || "",
      },
      {
        judul: "No. Telepon Pengusul",
        detail: usulan.telponPengusul,
      },
    ];

    // Print Table
    doc.autoTable(
      [
        { title: "Judul", dataKey: "judul" },
        { title: "Detail", dataKey: "detail" },
      ],
      rowsInformasi,
      {
        theme: "grid",
        startY: curPosY,
        styles: { overflow: "linebreak", cellPadding: 5 },
        showHead: "never",
        columnStyles: {
          judul: { cellWidth: "wrap" },
          detail: { cellWidth: "wrap" },
        },
      }
    );
    curPosY += 300;

    //  Lokasi
    doc.text(40, curPosY, "Lokasi");
    curPosY += 12;
    // print table
    doc.autoTable(
      [
        { title: "#", dataKey: "#" },
        { title: "Kecamatan", dataKey: "kecamatan" },
        { title: "Desa", dataKey: "desa" },
        { title: "Jumlah Unit", dataKey: "jumlahUnit" },
      ],
      locations?.map((location, index) => ({
        "#": index + 1,
        kecamatan: location.Kecamatan
          ? location.KecamatanId === 0
            ? location.KecamatanLainnya
            : location.Kecamatan.nama
          : "",
        desa: location.Desa
          ? location.DesaId === 0
            ? location.DesaLainnya
            : location.Desa.nama
          : "",
        jumlahUnit: location.jumlahUnit,
      })),
      {
        theme: "grid",
        startY: curPosY,
        headStyles: {
          fillColor: false,
          halign: "center",
          valign: "middle",
          lineColor: 200,
          lineWidth: 1,
          textColor: 20,
        },
        styles: { overflow: "linebreak", cellPadding: 4 },
      }
    );
    doc.addPage();

    curPosY = 44;
    // ------- TABEL VERMIN ---------
    // HEADER
    doc.setFontSize(fontSizeTitle);
    doc.setTextColor(40);
    doc.setFont(undefined, "normal");

    // Title
    title = `Usulan Kabupaten ${usulan.City && usulan.City.nama}`;
    doc.text(getCenterOffsetPDF(doc, title), 32, title);
    curPosY += 12;

    // subtitle
    doc.setFontSize(fontSizeSubTitle);
    doc.setTextColor(40);
    text = `Nomor Usulan ${usulan.noUsulan}`;
    doc.text(getCenterOffsetPDF(doc, text), curPosY, text);
    curPosY += 32;

    if (Array.isArray(documents)) {
      doc.text(40, curPosY, "Verifikasi Admin");
      curPosY += 12;
      doc.autoTable(verminDocumentsTableConfig(documents, curPosY));
    }
    // ------- END TABEL VERMIN ---------

    // ------- START TABLE VERTEK --------
    let columnsPersonilVertek = [
      { title: "Judul", dataKey: "judul" },
      { title: "Detail", dataKey: "detail" },
    ];
    let columnsVertek = [
      { title: "No", dataKey: "no" },
      { title: "Uraian", dataKey: "uraian" },
      { title: "Keterangan", dataKey: "keterangan" },
    ];

    if (isAdmin) {
      let rowsVertek = [];
      for (let i = 0; i < locations.length; i++) {
        const locationId = locations[i].id;
        const { data: dataVertek } = await store.dispatch(
          v3ApiNew.endpoints.getVertekByLocationId.initiate(locationId)
        );
        // HEADER
        doc.addPage();
        let curPos2Y = 44;
        // subtitle
        doc.setFontSize(fontSizeSubTitle);
        doc.setTextColor(40);
        doc.text(40, curPos2Y, "Verifikasi Teknis");
        curPos2Y += 20;

        // H1 Lokasi Vertek
        let item = locations[i];
        doc.setFontSize(fontSizeH1);
        doc.text(
          40,
          curPos2Y,
          `Kecamatan: ${
            item.Kecamatan
              ? item.KecamatanId === 0
                ? item.KecamatanLainnya
                : item.Kecamatan.nama
              : ""
          }`
        );
        curPos2Y += 15;
        doc.text(
          40,
          curPos2Y,
          `Desa: ${
            item.Desa
              ? item.DesaId === 0
                ? item.DesaLainnya
                : item.Desa.nama
              : ""
          }`
        );
        curPos2Y += 30;
        // Personil: Validator PUPR
        doc.setFontSize(fontSizeH1);
        doc.text(40, curPos2Y, "Validator PUPR");
        curPos2Y += 5;
        rowsVertek[i] = getPersonilVertekData(dataVertek, "Pupr");
        doc.autoTable(columnsPersonilVertek, rowsVertek[i], {
          theme: "grid",
          startY: curPos2Y,
          styles: { overflow: "linebreak", cellPadding: 5 },
          showHead: "never",
          columnStyles: {
            judul: { cellWidth: "wrap" },
            detail: { cellWidth: "wrap" },
          },
        });

        // Personil: Balai/Satker
        curPos2Y += 110;
        doc.setFontSize(fontSizeH1);
        doc.text(40, curPos2Y, "Balai/Satker");
        curPos2Y += 5;
        rowsVertek[i] = getPersonilVertekData(dataVertek, "Snvt");
        doc.autoTable(columnsPersonilVertek, rowsVertek[i], {
          theme: "grid",
          startY: curPos2Y,
          styles: { overflow: "linebreak", cellPadding: 5 },
          showHead: "never",
          columnStyles: {
            judul: { cellWidth: "wrap" },
            detail: { cellWidth: "wrap" },
          },
        });

        // Personil: PejKabKota
        curPos2Y += 110;
        doc.setFontSize(fontSizeH1);
        doc.text(40, curPos2Y, "Pejabat Kab/Kota");
        curPos2Y += 5;
        rowsVertek[i] = getPersonilVertekData(dataVertek, "PejKabKota");
        doc.autoTable(columnsPersonilVertek, rowsVertek[i], {
          theme: "grid",
          startY: curPos2Y,
          styles: { overflow: "linebreak", cellPadding: 5 },
          showHead: "never",
          columnStyles: {
            judul: { cellWidth: "wrap" },
            detail: { cellWidth: "wrap" },
          },
        });

        // Section: Data Umum
        let lastY = doc.autoTable.previous.finalY;
        curPos2Y = lastY + 20;
        doc.setFontSize(fontSizeH1);
        doc.text(40, curPos2Y, "Data Umum");
        curPos2Y += 5;
        const dataUmum = [];
        for (let i = 0; i < dataUmumFields.length; i++) {
          const dataUmumField = dataUmumFields[i];
          if (dataUmumField.id === "tglVertek") {
            dataUmum.push({
              no: i + 1,
              uraian: dataUmumField.label,
              keterangan:
                dataVertek && dataVertek[dataUmumField.id]
                  ? moment(dataVertek[dataUmumField.id]).format("DD-MM-YYYY")
                  : "",
            });
          } else {
            dataUmum.push({
              no: i + 1,
              uraian: dataUmumField.label,
              keterangan:
                dataVertek && dataVertek[dataUmumField.id]
                  ? dataVertek[dataUmumField.id]
                  : "",
            });
          }
        }
        doc.autoTable(columnsVertek, dataUmum, {
          theme: "grid",
          startY: curPos2Y,
          styles: { overflow: "linebreak", cellPadding: 5 },
          headerStyles: {
            fillColor: false,
            valign: "middle",
            lineColor: 200,
            lineWidth: 1,
            textColor: 20,
          },
          columnStyles: {
            no: { cellWidth: "wrap" },
            uraian: { cellWidth: "wrap" },
            keterangan: { cellWidth: "wrap" },
          },
        });

        // Section: Data Lahan
        lastY = doc.autoTable.previous.finalY;
        curPos2Y = lastY + 30;
        doc.setFontSize(fontSizeH1);
        doc.text(40, curPos2Y, "Data Lahan");
        curPos2Y += 5;
        const dataLahan = [];
        for (let i = 0; i < dataLahanFields.length; i++) {
          const dataLahanField = dataLahanFields[i];
          dataLahan.push({
            no: i + 1,
            uraian: dataLahanField.label,
            keterangan:
              dataVertek && dataVertek[dataLahanField.id]
                ? dataVertek[dataLahanField.id]
                : "",
          });
        }
        doc.autoTable(columnsVertek, dataLahan, {
          theme: "grid",
          startY: curPos2Y,
          styles: { overflow: "linebreak", cellPadding: 5 },
          headerStyles: {
            fillColor: false,
            valign: "middle",
            lineColor: 200,
            lineWidth: 1,
            textColor: 20,
          },
          columnStyles: {
            no: { cellWidth: "wrap" },
            uraian: { cellWidth: "wrap" },
            keterangan: { cellWidth: "wrap" },
          },
        });

        // Section: Lain-lain
        lastY = doc.autoTable.previous.finalY;
        curPos2Y = lastY + 30;
        doc.setFontSize(fontSizeH1);
        doc.text(40, curPos2Y, "Lain-lain");
        curPos2Y += 5;
        const dataLain = [];
        for (let i = 0; i < dataLainFields.length; i++) {
          const dataLainField = dataLainFields[i];
          dataLain.push({
            no: i + 1,
            uraian: dataLainField.label,
            keterangan:
              dataVertek && dataVertek[dataLainField.id]
                ? dataVertek[dataLainField.id]
                : "",
          });
        }
        doc.autoTable(columnsVertek, dataLain, {
          theme: "grid",
          startY: curPos2Y,
          styles: { overflow: "linebreak", cellPadding: 5 },
          headerStyles: {
            fillColor: false,
            valign: "middle",
            lineColor: 200,
            lineWidth: 1,
            textColor: 20,
          },
          columnStyles: {
            judul: { cellWidth: "wrap" },
            detail: { cellWidth: "wrap" },
          },
        });
      }
    }
    // ------- END TABLE VERTEK --------

    let filenameDownload;
    filenameDownload = `Usulan - Rusus - ${moment(usulan.tglSurat)
      .format("DD-MM-YYYY")
      ?.toString()} - ${usulan.noUsulan}.pdf`;
    if (return64 === true) {
      return {
        namePdf: filenameDownload,
        filePdf: btoa(doc.output()),
      };
    }
    return doc.save(filenameDownload);
  } catch (err) {
    console.error({ err });
    sweetalert.fire("Gagal", "Download PDF gagal...", "error");
  }
}

export default downloadPdfRusus;
