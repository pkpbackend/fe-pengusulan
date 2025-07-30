// ** Custom Components
import {
  TIPE_USULAN,
  JENIS_DATA_USULAN,
} from "../../../../../../constants/usulan";

// ** Third Party Components
import { Table } from "reactstrap";
import _ from "lodash";
import moment from "moment";

import "../../detail.scss";
import VerminDetail from "./shared/VerminDetail";

const RuswaDetail = (props) => {
  const { usulan } = props;
  const isRegularForm =
    Number(usulan.jenisData) === 1 || Number(usulan.jenisData) === 5;
  return (
    <>
      <Table size="sm" responsive>
        <tbody>
          <tr>
            <td className="row-head-first">Nomor Usulan</td>
            <td>{usulan.noUsulan || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Nomor KONREG</td>
            <td>{usulan.siproId || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Tipe Usulan</td>
            <td>
              {_.find(TIPE_USULAN, (o) => o.direktorat === usulan.DirektoratId)
                .name || "-"}
            </td>
          </tr>
          <tr>
            <td className="row-head">Jenis Usulan</td>
            <td>
              {_.find(
                JENIS_DATA_USULAN.non_ruk,
                (o) => o.value === Number(usulan.jenisData)
              )?.label || "-"}
            </td>
          </tr>
          {isRegularForm ? null : (
            <>
              <tr>
                <td className="row-head">NIK PIC Pengusul</td>
                <td>{usulan.nik || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Nama PIC Pengusul</td>
                <td>{usulan.picPengusul || "-"}</td>
              </tr>
            </>
          )}
          <tr>
            <td className="row-head">Nomor Surat</td>
            <td>{usulan.noSurat || "-"}</td>
          </tr>
          <tr>
            <td className="row-head">Tanggal Surat</td>
            <td>
              {usulan.tglSurat
                ? moment(usulan.tglSurat).format("DD/MM/YYYY")
                : "-"}
            </td>
          </tr>
          {isRegularForm ? (
            <tr>
              <td className="row-head">
                Penandatangan Surat Usulan (Bupati/Walikota)
              </td>
              <td>{usulan.ttdBupati ?? "-"}</td>
            </tr>
          ) : null}
          <tr>
            <td className="row-head">Tahun Anggaran</td>
            <td>{usulan.tahunProposal || "-"}</td>
          </tr>
          {isRegularForm ? null : (
            <tr>
              <td className="row-head-first">Total Unit</td>
              <td>
                <strong>
                  {usulan.jumlahUnit
                    ? Number(usulan.jumlahUnit).toLocaleString()
                    : "0"}
                </strong>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {isRegularForm ? (
        <>
          <br />
          <h5>Data Pengusul</h5>
          <hr style={{ marginBottom: 0 }}></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head-first">NIK PIC</td>
                <td>{usulan.nik || "-"}</td>
              </tr>
              <tr>
                <td className="row-head-first">Nama PIC</td>
                <td>{usulan.picPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Jabatan PIC</td>
                <td>{usulan.jabatanPic || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Email PIC</td>
                <td>{usulan.email || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">No. Telepon PIC</td>
                <td>{usulan.telponPengusul || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Instansi/Lembaga</td>
                <td>{usulan.instansi || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Alamat Instansi/Lembaga</td>
                <td>{usulan.alamatInstansi || "-"}</td>
              </tr>
            </tbody>
          </Table>
          <br />
          <h5>Sasaran/Lokasi</h5>
          <hr style={{ marginBottom: 0 }}></hr>
          <Table size="sm" responsive>
            <tbody>
              <tr>
                <td className="row-head-first">Penerima Manfaat</td>
                <td>{usulan.PenerimaManfaat?.tipe || "-"}</td>
              </tr>
              <tr>
                <td className="row-head-first">Provinsi</td>
                <td>{usulan.Provinsi?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Kabupaten</td>
                <td>{usulan.City?.nama || "-"}</td>
              </tr>
              <tr>
                <td className="row-head">Jumlah Unit Peningkatan Kualitas</td>
                <td>
                  {usulan.jumlahUnitPk
                    ? Number(usulan.jumlahUnitPk).toLocaleString()
                    : "0"}
                </td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : null}

      <VerminDetail usulan={usulan} />
    </>
  );
};

export default RuswaDetail;
