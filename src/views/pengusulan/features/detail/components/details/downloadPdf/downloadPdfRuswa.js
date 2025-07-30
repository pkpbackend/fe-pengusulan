import sweetalert from "@src/utility/sweetalert";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const colorGreen = [67, 160, 71];
const colorOrange = [245, 127, 23];
const colorRed = [244, 67, 54];
const colorYellow = [255, 193, 7];

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

async function downloadPdfRuswa({
  return64 = false,
  usulan,
  documents,
  locations = [],
}) {
  const isRegularForm =
    Number(usulan.jenisData) === 1 || Number(usulan.jenisData) === 5;

  try {
    const fontSizeTitle = 20;
    let doc = new jsPDF("p", "pt", "a4");
    let curPosY = 44;

    // HEADER
    doc.setFontSize(fontSizeTitle);
    doc.setTextColor(40);
    doc.setFont(undefined, "normal");

    // Title
    let title = `Pengusulan`;
    doc.text(getCenterOffsetPDF(doc, title), 32, title);
    curPosY += 12;

    // H1
    doc.text(40, curPosY, "Informasi");
    curPosY += 12;

    const rowsInformasi = isRegularForm
      ? [
          {
            judul: "NIK PIC Pengusul",
            detail: usulan.nik,
          },
          {
            judul: "Nama PIC Pengusul",
            detail: usulan.picPengusul,
          },
          {
            judul: "Jabatan PIC Pengusul",
            detail: usulan.jabatanPic,
          },
          {
            judul: "Email PIC Pengusul",
            detail: usulan.email,
          },
          {
            judul: "No. Telepon Pengusul",
            detail: usulan.telponPengusul,
          },
          {
            judul: "Instansi/Lembaga Pengusul",
            detail: usulan.instansi || "",
          },
          {
            judul: "Alamat Instansi/Lembaga Pengusul",
            detail: usulan.alamatInstansi || "",
          },
          {
            judul: "Penerima Manfaat",
            detail: usulan.PenerimaManfaat ? usulan.PenerimaManfaat.tipe : "",
          },
          {
            judul: "Tahun Anggaran",
            detail: usulan.tahunProposal,
          },
          {
            judul: "Provinsi",
            detail: usulan.Provinsi ? usulan.Provinsi.nama.toUpperCase() : "",
          },
          {
            judul: "Kabupaten/Kota",
            detail: usulan.City ? usulan.City.nama.toUpperCase() : "",
          },
          {
            judul: "Penandatangan Surat Usulan",
            detail: usulan.ttdBupati || "",
          },
        ]
      : [
          {
            judul: "NIK PIC Pengusul",
            detail: usulan.nik,
          },
          {
            judul: "Nama PIC Pengusul",
            detail: usulan.picPengusul,
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
            judul: "Tahun Anggaran",
            detail: usulan.tahunProposal,
          },
        ];
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
    curPosY += isRegularForm ? 300 : 200;
    // Section: Table Vermin
    if (Array.isArray(documents)) {
      doc.text(40, curPosY, "Verifikasi Admin");
      curPosY += 12;
      doc.autoTable(verminDocumentsTableConfig(documents, curPosY));
    }

    doc.addPage();
    curPosY = 44;
    // Section: Lokasi
    doc.text(40, curPosY, "Lokasi");
    curPosY += 12;
    // print table
    doc.autoTable(
      isRegularForm
        ? [
            { title: "#", dataKey: "#" },
            { title: "Kecamatan", dataKey: "kecamatan" },
            { title: "Desa", dataKey: "desa" },
            { title: "Jumlah Unit", dataKey: "jumlahUnit" },
          ]
        : [
            { title: "#", dataKey: "#" },
            { title: "Provinsi", dataKey: "provinsi" },
            { title: "Jumlah Unit", dataKey: "jumlahUnit" },
          ],
      locations?.map((location, index) => ({
        "#": index + 1,
        provinsi: location.Provinsi ? location.Provinsi.nama : "",
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
    let filenameDownload;
    filenameDownload = `Usulan - Swadaya - ${moment(usulan.tglSurat)
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

export default downloadPdfRuswa;
