// ** Third Party Components
import { Badge, Table } from "reactstrap";
import moment from "moment";

import "../../detail.scss";

const KonregDetail = (props) => {
  const { data } = props;

  const renderKonregStatus = () => {
    let record = data;

    if (
      record.anggaran !== null &&
      record.kroId !== null &&
      record.uraian !== null &&
      record.siproId !== null &&
      record.statusVermin === 1
    ) {
      return (
        <Badge pill color="success">
          Sync
        </Badge>
      );
    } else if (
      record.anggaran !== null &&
      record.kroId !== null &&
      record.uraian !== null &&
      record.statusVermin === 1
    ) {
      return (
        <Badge pill color="primary">
          Pool
        </Badge>
      );
    } else {
      return (
        <Badge pill color="secondary">
          Belum
        </Badge>
      );
    }
  };

  return (
    <Table size="sm" responsive bordered>
      <tbody>
        <tr className="d-none d-md-table-row">
          <td className="row-head">ID Konreg</td>
          <td style={{ whiteSpace: "nowrap" }}>{data?.siproId || "-"}</td>
          <td className="row-head">Konreg Status</td>
          <td>{renderKonregStatus()}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">ID Konreg</td>
          <td colSpan={3}>{data?.siproId || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Konreg Status</td>
          <td colSpan={3}>{renderKonregStatus()}</td>
        </tr>
        <tr>
          <td className="row-head">Tanggal Sync Konreg</td>
          <td colSpan={3}>
            {data.sikonregData?.createdAt
              ? moment(data.sikonregData?.createdAt).format(
                  "DD/MM/YYYY HH:mm:ss"
                )
              : "-"}
          </td>
        </tr>
        <tr>
          <td className="row-head">Provinsi</td>
          <td colSpan={3}>
            {data?.sikonregData?.kode_provinsi || "-"} |{" "}
            {data?.sikonregData?.nama_provinsi || "-"}
          </td>
        </tr>
        <tr>
          <td className="row-head">Kabupaten</td>
          <td colSpan={3}>
            {data?.sikonregData?.kode_kabkot || "-"} |{" "}
            {data?.sikonregData?.nama_kabkot || "-"}
          </td>
        </tr>
        <tr>
          <td className="row-head">Unit</td>
          <td colSpan={3}>
            {data?.sikonregData?.kode_unit || "-"} |{" "}
            {data?.sikonregData?.nama_unit || "-"}
          </td>
        </tr>
        <tr>
          <td className="row-head">Program</td>
          <td colSpan={3}>
            {data?.sikonregData?.kdprogram || "-"} |{" "}
            {data?.sikonregData?.nmprogram || "-"}
          </td>
        </tr>
        <tr>
          <td className="row-head">Kegiatan</td>
          <td colSpan={3}>
            {data?.sikonregData?.kdgiat || "-"} |{" "}
            {data?.sikonregData?.nmgiat || "-"}
          </td>
        </tr>
        <tr>
          <td className="row-head">KRO</td>
          <td colSpan={3}>
            {data?.sikonregData?.kdkro || "-"} |{" "}
            {data?.sikonregData?.nmkro || "-"}
          </td>
        </tr>
        <tr>
          <td className="row-head">RO</td>
          <td colSpan={3}>
            {data?.sikonregData?.no_ro || "-"} |{" "}
            {data?.sikonregData?.nmro || "-"}
          </td>
        </tr>
        <tr>
          <td className="row-head">Pekerjaan</td>
          <td colSpan={3}>{data?.sikonregData?.pekerjaan || "-"}</td>
        </tr>
        <tr className="d-none d-md-table-row">
          <td className="row-head">Volume</td>
          <td>
            {data?.sikonregData?.volume || "-"} |{" "}
            {data?.sikonregData?.satuan || "-"}
          </td>
          <td className="row-head">Biaya (Rp 000)</td>
          <td>{Number(data.sikonregData?.biaya || 0).toLocaleString()}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Volume</td>
          <td>
            {data?.sikonregData?.volume || "-"} |{" "}
            {data?.sikonregData?.satuan || "-"}
          </td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Biaya (Rp 000)</td>
          <td>{Number(data.sikonregData?.biaya || 0).toLocaleString()}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kode Waktu Pelaksanaan</td>
          <td>{data?.sikonregData?.kode_waktu_pelaksanaan || "-"}</td>
          <td className="row-head">Waktu Pelaksanaan</td>
          <td>{data?.sikonregData?.waktu_pelaksanaan || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kode Waktu Pelaksanaan</td>
          <td>{data?.sikonregData?.kode_waktu_pelaksanaan || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Waktu Pelaksanaan</td>
          <td>{data?.sikonregData?.waktu_pelaksanaan || "-"}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kode Sumber Pembiayaan</td>
          <td>{data?.sikonregData?.kode_sumber_pembiayaan || "-"}</td>
          <td className="row-head">Sumber Pembiayaan</td>
          <td>{data?.sikonregData?.sumber_pembiayaan || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kode Sumber Pembiayaan</td>
          <td>{data?.sikonregData?.kode_sumber_pembiayaan || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Sumber Pembiayaan</td>
          <td>{data?.sikonregData?.sumber_pembiayaan || "-"}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kesiapan Rencana Induk</td>
          <td>{data?.sikonregData?.kesiapan_renc_induk || "-"}</td>
          <td className="row-head">Dokumen Rencana Induk</td>
          <td>{data?.sikonregData?.dok_renc_induk || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kesiapan Rencana Induk</td>
          <td>{data?.sikonregData?.kesiapan_renc_induk || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Dokumen Rencana Induk</td>
          <td>{data?.sikonregData?.dok_renc_induk || "-"}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kesiapan FS</td>
          <td>{data?.sikonregData?.kesiapan_fs || "-"}</td>
          <td className="row-head">Dokumen FS</td>
          <td>{data?.sikonregData?.dok_fs || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kesiapan FS</td>
          <td>{data?.sikonregData?.kesiapan_fs || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Dokumen FS</td>
          <td>{data?.sikonregData?.dok_fs || "-"}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kesiapan DED</td>
          <td>{data?.sikonregData?.kesiapan_ded || "-"}</td>
          <td className="row-head">Dokumen DED</td>
          <td>{data?.sikonregData?.dok_ded || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kesiapan FS</td>
          <td>{data?.sikonregData?.kesiapan_fs || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Dokumen FS</td>
          <td>{data?.sikonregData?.dok_fs || "-"}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kesiapan Dokumen Lingkungan</td>
          <td>{data?.sikonregData?.kesiapan_dokling || "-"}</td>
          <td className="row-head">Dokumen Lingkungan</td>
          <td>{data?.sikonregData?.dok_dokling || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kesiapan Dokumen Lingkungan</td>
          <td>{data?.sikonregData?.kesiapan_dokling || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Dokumen Lingkungan</td>
          <td>{data?.sikonregData?.dok_dokling || "-"}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kesiapan Lahan</td>
          <td>{data?.sikonregData?.kesiapan_lahan || "-"}</td>
          <td className="row-head">Dokumen Lahan</td>
          <td>{data?.sikonregData?.dok_lahan || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kesiapan Lahan</td>
          <td>{data?.sikonregData?.kesiapan_lahan || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Dokumen Lahan</td>
          <td>{data?.sikonregData?.dok_lahan || "-"}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kesiapan Pasca Konstruksi</td>
          <td>{data?.sikonregData?.kesiapan_pasca_kons || "-"}</td>
          <td className="row-head">Dokumen Pasca Konstruksi</td>
          <td>{data?.sikonregData?.dok_pasca_kons || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kesiapan Pasca Konstruksi</td>
          <td>{data?.sikonregData?.kesiapan_pasca_kons || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Dokumen Pasca Konstruksi</td>
          <td>{data?.sikonregData?.dok_pasca_kons || "-"}</td>
        </tr>

        <tr className="d-none d-md-table-row">
          <td className="row-head">Kesediaan Penerimaan Bantuan</td>
          <td>{data?.sikonregData?.kesediaan_terima_bantuan || "-"}</td>
          <td className="row-head">Dokumen Kesediaan Penerimaan </td>
          <td>{data?.sikonregData?.dok_kesediaan_terima_bantuan || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Kesediaan Penerimaan Bantuan</td>
          <td>{data?.sikonregData?.kesediaan_terima_bantuan || "-"}</td>
        </tr>
        <tr className="d-md-none">
          <td className="row-head">Dokumen Kesediaan Penerimaan </td>
          <td>{data?.sikonregData?.dok_kesediaan_terima_bantuan || "-"}</td>
        </tr>

        <tr>
          <td className="row-head">No Prioritas</td>
          <td colSpan={3}>{data?.sikonregData?.no_prioritas || "-"}</td>
        </tr>
        <tr>
          <td className="row-head">Tematik</td>
          <td colSpan={3}>
            {data?.sikonregData?.tematik?.map((tema, index) => {
              return (
                <span key={index}>
                  {index + 1}. {tema.kdtematik} | {tema.tematik} |{" "}
                  {tema.uraian || "-"}
                  <br></br>
                </span>
              );
            })}
          </td>
        </tr>
        <tr>
          <td className="row-head">Geotagging</td>

          <td colSpan={3}>
            {data.sikonregData?.geotagging ? (
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(data.sikonregData?.geotagging)}
              </pre>
            ) : (
              "-"
            )}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default KonregDetail;
