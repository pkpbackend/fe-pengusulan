import jsPDF from "jspdf";
import moment from "moment";
import _ from "lodash";
import { JENIS_DATA_USULAN } from "@constants/usulan";
import "jspdf-autotable";
import sweetalert from "@src/utility/sweetalert";

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

async function downloadPdfRuk({ return64 = false, usulan, documents }) {
  const isPemda = Number(usulan.jenisData) !== 7;
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

    let columnsInformasi = [
      { title: "Judul", dataKey: "judul" },
      { title: "Detail", dataKey: "detail" },
    ];

    const rowsInformasi = [
      {
        judul: "Jenis Usualan",
        detail:
          _.find(
            JENIS_DATA_USULAN.ruk,
            (o) => o.value === Number(usulan.jenisData)
          ).label || "-",
      },
      {
        judul: "Tanggal Surat",
        detail: moment(usulan.tglSurat).format("DD-MM-YYYY"),
      },
      ...(!isPemda
        ? [
            {
              judul: "Pengembang",
              detail: usulan.Pengembang?.nama || "",
            },
            {
              judul: "Nama Perusahaan",
              detail: usulan.Pengembang?.namaPerusahaan || "",
            },
            {
              judul: "No. HP",
              detail: usulan.Pengembang?.telpPenanggungJawab || "",
            },
            {
              judul: "Email",
              detail: usulan.Pengembang?.email || "",
            },
          ]
        : []),
      {
        judul: "Nama Komunitas",
        detail: usulan.namaKomunitas || "",
      },
      {
        judul: "Nama Perumahan",
        detail: usulan.namaPerumahan || "",
      },
      {
        judul: "Lokasi Perumahan",
        detail: usulan.alamatLokasi || "",
      },
      {
        judul: "Daya Tampung",
        detail: usulan.dayaTampung || "",
      },
      {
        judul: "Jumlah Usulan",
        detail: usulan.jumlahUsulan || "",
      },
      {
        judul: "Tahun Bantuan PSU",
        detail: usulan.tahunBantuanPsu || "",
      },
      {
        judul: "Provinsi",
        detail: usulan.Provinsi ? usulan.Provinsi.nama : "",
      },
      {
        judul: "Kabupaten",
        detail: usulan.City ? usulan.City.nama : "",
      },
      {
        judul: "Kecamatan",
        detail: usulan.Kecamatan ? usulan.Kecamatan.nama : "",
      },
      {
        judul: "Desa",
        detail: usulan.Desa ? usulan.Desa.nama : "",
      },
      ...(isPemda
        ? []
        : [
            {
              judul: "Asosiasi",
              detail: usulan?.Perusahaan.asosiasi || "",
            },
            {
              judul: "Lokasi Perusahaan",
              detail: usulan.Perusahaan?.alamat || "",
            },
            {
              judul: "Nama Direktur",
              detail: usulan.Perusahaan?.namaDirektur || "",
            },
            {
              judul: "Email Perusahaan",
              detail: usulan.Perusahaan?.email || "",
            },
            {
              judul: "Website Perusahaan",
              detail: usulan.Perusahaan?.website || "",
            },
            {
              judul: "Kode Pos",
              detail: usulan.Perusahaan?.kodePos || "",
            },
            {
              judul: "RT / RW",
              detail: usulan.Perusahaan?.rtRw || "",
            },
            {
              judul: "No. Telp. Kantor",
              detail: usulan.Perusahaan?.telpKantor || "",
            },
            {
              judul: "No. Telp. Direktur",
              detail: usulan.Perusahaan?.telpDirektur || "",
            },
            {
              judul: "No. Telp. Penanggung Jawab",
              detail: usulan.Perusahaan?.telpPenanggungJawab || "",
            },
            {
              judul: "Provinsi Perusahaan",
              detail: usulan.Perusahaan?.Provinsi
                ? usulan.Perusahaan?.Provinsi.nama
                : "",
            },
            {
              judul: "Kabupaten Perusahaan",
              detail: usulan.Perusahaan?.City
                ? usulan.Perusahaan?.City.nama
                : "",
            },
            {
              judul: "Kecamatan Perusahaan",
              detail: usulan.Perusahaan?.Kecamatan
                ? usulan.Perusahaan?.Kecamatan.nama
                : "",
            },
            {
              judul: "Desa Perusahaan",
              detail: usulan.Perusahaan?.Desa
                ? usulan.Perusahaan?.Desa.nama
                : "",
            },
          ]),
      {
        judul: "User Pengusul",
        detail: usulan.User ? usulan.User.nama : "",
      },
    ];

    // Print Table
    doc.autoTable(columnsInformasi, rowsInformasi, {
      theme: "grid",
      startY: curPosY,
      styles: { overflow: "linebreak", cellPadding: 5 },
      showHead: "never",
      columnStyles: {
        judul: { cellWidth: "wrap" },
        detail: { cellWidth: "wrap" },
      },
    });
    doc.addPage();
    curPosY = 44;
    if (Array.isArray(documents)) {
      doc.text(40, curPosY, "Verifikasi Admin");
      curPosY += 12;
      doc.autoTable(verminDocumentsTableConfig(documents, curPosY));
    }

    let filenameDownload;
    filenameDownload = `Usulan - Ruk - ${moment(usulan.tglSurat)
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
    sweetalert.fire("Gagal", "Download PDF gagal...", "error");
  }
}

export default downloadPdfRuk;
